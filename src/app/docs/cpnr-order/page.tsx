export default function CpnrOrderDocsPage() {
  return (
    <main style={{ padding: "16px" }}>
      <h1 style={{ marginTop: 0 }}>CPNR Order API Docs</h1>
      <p>
        Swagger UI: <a href="/cpnr-order-swagger.html" target="_blank" rel="noreferrer">open in new tab</a>
      </p>
      <p>
        Raw OpenAPI JSON: <a href="/api/docs/cpnr-order/v1/openapi" target="_blank" rel="noreferrer">/api/docs/cpnr-order/v1/openapi</a>
      </p>
      <p>
        Swagger shows <code>Public APIs</code> and <code>Internal Access</code> by default. After calling <code>POST /api/internal-auth/login</code>, refresh the Swagger page to reveal the <code>S2S / Internal BC APIs</code> section.
      </p>
      <ul>
        <li><strong>Public APIs</strong>: <code>/api/banners</code>, <code>/api/items</code>, <code>/api/special-request-presets</code>, <code>/api/payments/session</code>, <code>/api/payments/confirm</code>, <code>/api/checkout/complete</code>.</li>
        <li><strong>S2S / Internal BC APIs</strong>: browser-safe wrappers for customers, order details/lines/line-profiles, uploads, plus the raw <code>/api/bc/orders</code> reference route. Hidden until internal auth is done and the Swagger page is refreshed.</li>
        <li><strong>Internal Access</strong>: <code>/api/internal-auth/login</code>, <code>/api/internal-auth/logout</code>, <code>/api/internal-auth/session</code>.</li>
      </ul>
      <iframe
        title="CPNR Swagger UI"
        src="/cpnr-order-swagger.html"
        style={{ width: "100%", height: "78vh", border: "1px solid #ddd", borderRadius: "8px" }}
      />
    </main>
  )
}

