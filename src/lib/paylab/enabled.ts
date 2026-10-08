/**
 * Gate 1 of the payment lab's three access gates.
 *
 * `ENABLE_PAY_LAB` is set on the dedicated paylab Vercel project and nowhere
 * else, so the lab page and its API routes 404 on the storefront even if this
 * branch is ever merged into main.
 */
export function isPayLabEnabled(): boolean {
  return process.env.ENABLE_PAY_LAB?.trim() === 'true'
}
