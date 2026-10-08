#!/usr/bin/env node
/* global process, console */

import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const API_ROOT = path.join(PROJECT_ROOT, 'src', 'app', 'api');
const GUARD_MANIFEST_PATH = path.join(PROJECT_ROOT, 'src', 'lib', 'guard', 'guard-manifest.ts');
const PUBLIC_MUTATING_GUARD_EXEMPT_PATTERNS = [
  /^\/api\/cron\//,
  /^\/api\/webhooks\//,
  /^\/api\/auth\//,
  // Stripe's own signature verification (HMAC over the raw body via
  // stripe-signature) is this route's authentication — it intentionally
  // doesn't use runRequestGuards()/assertRequestGuards(), since that guard
  // stack expects our own HMAC/API-key headers, which Stripe never sends.
  /^\/api\/payments\/webhook$/,
  // Health endpoint is intentionally guard-free: CyberSource pings it with POST
  // as part of subscription health monitoring. Adding guards would cause
  // health check failures → subscription auto-suspension → no webhook delivery.
  /^\/api\/health$/,
];

function toPosix(inputPath) {
  return inputPath.split(path.sep).join('/');
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '');
}

/** BC routes use `assertRequestGuards`; other stacks may use `runRequestGuards`. */
function usesGuards(code) {
  return code.includes('runRequestGuards(') || code.includes('assertRequestGuards(');
}

function routePathFromFile(filePath) {
  const rel = toPosix(path.relative(API_ROOT, filePath));
  const dir = rel.replace(/\/route\.ts$/, '');
  const routeDir = dir
    .split('/')
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')))
    .map((segment) => {
      if (segment.startsWith('[...') && segment.endsWith(']')) {
        const name = segment.slice(4, -1);
        return `:${name}*`;
      }
      if (segment.startsWith('[') && segment.endsWith(']')) {
        const name = segment.slice(1, -1);
        return `:${name}`;
      }
      return segment;
    })
    .join('/');

  return routeDir ? `/api/${routeDir}` : '/api';
}

function routeMetaFromFile(filePath) {
  const rel = toPosix(path.relative(API_ROOT, filePath));
  const dir = rel.replace(/\/route\.ts$/, '');
  const segments = dir.split('/').filter(Boolean);

  return {
    rel,
    segments,
    isCustomer: segments[0] === 'customer',
    isAdmin: segments[0] === 'admin',
    isPublic: segments.includes('(public)'),
    isS2S: segments.includes('(s2s)'),
  };
}

function collectRouteFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectRouteFiles(abs));
      continue;
    }
    if (entry.isFile() && entry.name === 'route.ts') {
      files.push(abs);
    }
  }

  return files;
}

function endpointPatternToRegex(endpointPattern) {
  const escaped = endpointPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexSource = escaped.replace(/\\:[A-Za-z0-9_*]+/g, '[^/]+');
  return new RegExp(`^${regexSource}$`);
}

function matchesPattern(routePath, pattern) {
  return endpointPatternToRegex(pattern).test(routePath);
}

function hasMutatingHandler(code) {
  return /\bexport\s+(?:async\s+)?function\s+(POST|PUT|PATCH|DELETE)\b/.test(code);
}

function isPublicMutatingGuardExempt(routePath) {
  return PUBLIC_MUTATING_GUARD_EXEMPT_PATTERNS.some((pattern) => pattern.test(routePath));
}

function parseGuardManifestEndpoints() {
  const manifestSource = fs.readFileSync(GUARD_MANIFEST_PATH, 'utf8');
  const endpoints = new Set();
  const regex = /['"`](\/api\/[^'"`]+)['"`]\s*:/g;
  let match;
  while ((match = regex.exec(manifestSource)) !== null) {
    endpoints.add(match[1]);
  }
  return Array.from(endpoints);
}

const rules = [
  {
    description: '/api/webhooks/cybersource must verify webhook signature',
    match: (routePath) => routePath === '/api/webhooks/cybersource',
    required: [
      {
        id: 'verifyWebhookSignature',
        test: (code) => code.includes('verifyWebhookSignature('),
      },
    ],
  },
];

function auditRoutes() {
  if (!fs.existsSync(API_ROOT)) {
    throw new Error(`API root not found: ${API_ROOT}`);
  }

  const guardManifestEndpoints = parseGuardManifestEndpoints();
  const routeFiles = collectRouteFiles(API_ROOT);
  const violations = [];

  for (const filePath of routeFiles) {
    const source = fs.readFileSync(filePath, 'utf8');
    const code = stripComments(source);
    const routePath = routePathFromFile(filePath);
    const meta = routeMetaFromFile(filePath);
    const relPath = toPosix(path.relative(PROJECT_ROOT, filePath));

    // customer => must call requireCustomer()
    if (meta.isCustomer && !code.includes('requireCustomer(')) {
      violations.push(`${relPath}: customer route missing requireCustomer() (${routePath})`);
    }
    // customer => must call runRequestGuards() or assertRequestGuards()
    if (meta.isCustomer && !usesGuards(code)) {
      violations.push(
        `${relPath}: customer route missing runRequestGuards() / assertRequestGuards() (${routePath})`
      );
    }

    // admin => must call requireAdminApiToken()
    if (meta.isAdmin && !code.includes('requireAdminApiToken(')) {
      violations.push(`${relPath}: admin route missing requireAdminApiToken() (${routePath})`);
    }

    // (s2s) => must call runRequestGuards() or assertRequestGuards()
    if (meta.isS2S && !usesGuards(code)) {
      violations.push(
        `${relPath}: (s2s) route missing runRequestGuards() / assertRequestGuards() (${routePath})`
      );
    }

    // (public) => must NOT use customer/admin auth
    if (meta.isPublic && code.includes('requireCustomer(')) {
      violations.push(`${relPath}: (public) route must not use requireCustomer() (${routePath})`);
    }
    if (meta.isPublic && code.includes('requireAdminApiToken(')) {
      violations.push(
        `${relPath}: (public) route must not use requireAdminApiToken() (${routePath})`
      );
    }

    // (public) mutating => must use guards unless intentionally exempt
    if (
      meta.isPublic &&
      hasMutatingHandler(code) &&
      !usesGuards(code) &&
      !isPublicMutatingGuardExempt(routePath)
    ) {
      violations.push(
        `${relPath}: (public) mutating route missing runRequestGuards() / assertRequestGuards() (${routePath})`
      );
    }

    for (const rule of rules) {
      if (!rule.match(routePath)) continue;

      const missing = rule.required.filter((requirement) => !requirement.test(code));
      if (missing.length > 0) {
        violations.push(
          `${relPath}: missing ${missing.map((entry) => entry.id).join(', ')} (${rule.description})`
        );
      }
    }

    if (usesGuards(code)) {
      const inManifest = guardManifestEndpoints.some((pattern) =>
        matchesPattern(routePath, pattern)
      );
      if (!inManifest) {
        violations.push(
          `${relPath}: uses request guards but route is not in guard-manifest (${routePath})`
        );
      }
    }
  }

  return { routeFiles, violations };
}

function main() {
  const { routeFiles, violations } = auditRoutes();

  console.log(`[guard-audit] Scanned ${routeFiles.length} API route files.`);

  if (violations.length === 0) {
    console.log('[guard-audit] PASS: no violations found.');
    process.exit(0);
  }

  console.error(`[guard-audit] FAIL: ${violations.length} violation(s) found.`);
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }

  process.exit(1);
}

main();
