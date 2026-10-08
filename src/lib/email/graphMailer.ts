import { getGraphToken } from "@/lib/graphAuth"

export class GraphMailError extends Error {
  readonly status: number
  readonly statusText: string
  readonly body: string

  constructor(status: number, statusText: string, body: string) {
    super(`Graph sendMail failed (${status} ${statusText}): ${body}`)
    this.status = status
    this.statusText = statusText
    this.body = body
  }
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export type OutgoingMail = {
  html: string
  replyTo?: string
  subject: string
  to: string
}

export async function sendMail(message: OutgoingMail): Promise<void> {
  const senderEmail = getRequiredEnv("GRAPH_SENDER_EMAIL")
  const token = await getGraphToken()

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: message.subject,
          body: {
            contentType: "HTML",
            content: message.html,
          },
          toRecipients: [{ emailAddress: { address: message.to } }],
          replyTo: message.replyTo
            ? [{ emailAddress: { address: message.replyTo } }]
            : undefined,
        },
        saveToSentItems: true,
      }),
      cache: "no-store",
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new GraphMailError(res.status, res.statusText, text)
  }
}
