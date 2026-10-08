let cachedToken: string | null = null
let tokenExpiry = 0

export async function getGraphToken(): Promise<string> {

  const tenantId = process.env.GRAPH_TENANT_ID
  const clientId = process.env.GRAPH_CLIENT_ID
  const clientSecret = process.env.GRAPH_CLIENT_SECRET

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing Microsoft Graph OAuth environment variables")
  }

  // reuse token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

  const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials"
      })
    })

    if (!res.ok) {
    const text = await res.text()
    throw new Error(`Graph OAuth failed: ${text}`)
  }

  const data = await res.json()

  cachedToken = data.access_token

  // refresh token slightly before expiry
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000

  if (!cachedToken) {
    throw new Error("Failed to obtain access token")
  }

  return cachedToken
}
