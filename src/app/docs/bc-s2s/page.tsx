export default function BcS2sDocsPage() {
  return (
    <main style={{ padding: "16px" }}>
      <h1 style={{ marginTop: 0 }}>CPNR Internal — Business Central S2S API Docs</h1>
      <p>
        <strong>Internal only.</strong> Documents the raw <code>/api/bc/**</code> server-to-server
        write routes that Business Central calls. The frontend never uses these.
      </p>
      <p>
        Swagger UI: <a href="/bc-s2s-swagger.html" target="_blank" rel="noreferrer">open in new tab</a>
      </p>
      <p>
        Raw OpenAPI JSON:{" "}
        <a href="/api/docs/bc-s2s/v1/openapi" target="_blank" rel="noreferrer">
          /api/docs/bc-s2s/v1/openapi
        </a>{" "}
        (returns <code>401</code> until you log in).
      </p>
      <p>
        Access is hard-gated: the spec returns <code>401</code> unless an internal viewer session is
        present. Call <code>POST /api/internal-auth/login</code> first, then load the Swagger page.
      </p>
      <ul>
        <li>
          <strong>Each endpoint shows before → after serialization</strong>: the clean payload you
          send vs. the exact payload BC receives (line arrays become a stringified{" "}
          <code>orderLinesJson</code> / <code>giftboxLinesJson</code>).
        </li>
        <li>
          <strong>Compulsory fields</strong> are marked required per schema, with conditional rules
          noted in each operation description.
        </li>
        <li>
          <strong>Signing</strong>: every request needs <code>x-api-key</code>,{" "}
          <code>x-timestamp-ms</code>, <code>x-nonce</code>, <code>x-signature</code> (HMAC-SHA256).
          Browser &quot;Try it out&quot; cannot sign in production — treat this as a reference.
        </li>
      </ul>
      <iframe
        title="CPNR BC S2S Swagger UI"
        src="/bc-s2s-swagger.html"
        style={{ width: "100%", height: "74vh", border: "1px solid #ddd", borderRadius: "8px" }}
      />
    </main>
  )
}
