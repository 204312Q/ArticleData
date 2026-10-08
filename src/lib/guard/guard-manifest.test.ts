import { it, expect, describe } from 'vitest';

import { getGuardConfig, normalizeGuardEndpoint } from './guard-manifest';

describe('normalizeGuardEndpoint', () => {
  it('removes trailing slash for non-root paths', () => {
    expect(normalizeGuardEndpoint('/api/bc/customers/')).toBe('/api/bc/customers');
  });

  it('keeps root path unchanged', () => {
    expect(normalizeGuardEndpoint('/')).toBe('/');
  });

  it('adds leading slash when missing', () => {
    expect(normalizeGuardEndpoint('api/bc/orders')).toBe('/api/bc/orders');
  });
});

describe('getGuardConfig', () => {
  it('matches static BC route with trailing slash', () => {
    expect(getGuardConfig('/api/bc/customers/')).not.toBeNull();
  });

  it('matches dynamic BC route with trailing slash', () => {
    expect(getGuardConfig('/api/bc/orders/SO-1001/details/')).not.toBeNull();
  });
});
