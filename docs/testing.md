# API Testing Guide

This project uses Vitest for route-level tests.

## Commands

- `yarn test` runs all tests once.
- `yarn test:watch` runs tests in watch mode.
- `yarn test:guard-audit` validates route guard coverage rules.

## File Layout

- `src/__tests__/setup.ts`: global test setup and mock cleanup.
- `src/__tests__/helpers/request-mock.ts`: request factories and JSON helpers.
- `src/__tests__/helpers/auth-mock.ts`: request guard pass/fail helpers.
- `src/__tests__/helpers/prisma-mock.ts`: Prisma mock factory for DB-related tests.
- `src/__tests__/helpers/test-data.ts`: reusable fixtures.

## Route Test Pattern

1. Mock route dependencies (`@/lib/guard/assert`, `@/lib/bcClient`, Prisma clients as needed).
2. Build requests with `createRequest` or `createJsonRequest`.
3. Call exported route handler (`GET`, `POST`, etc.).
4. Assert status code and JSON response shape.
5. Include a guard-failure case and at least one success/failure business case.

## Notes

- Keep tests deterministic by mocking external BC calls.
- Use `assertRequestGuards` short-circuit checks in every protected route test.
- Prefer fixture reuse from `test-data.ts` over inline literals.
