/**
 * WhatsApp Cloud API client (Meta).
 * Uses template messages — templates must be pre-approved in Meta Business Manager.
 * Free tier: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

import { renderTemplate, getTemplateParamsForApi, type TemplateName, type TemplateParams } from "./templates"
import { createAdminClient } from "./supabase/admin"

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0"

/**
 * Normalize phone to E.164 (e.g. 919876543210 for India).
 */
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10) return "91" + digits
  if (digits.startsWith("91") && digits.length === 12) return digits
  return digits
}

export interface SendWhatsAppOptions {
  /** School ID for notification log */
  schoolId: string
  /** Target user ID (optional, for logging) */
  targetUserId?: string | null
}

export interface SendWhatsAppResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send a WhatsApp template message via Meta Cloud API.
 * Logs every attempt to the notifications table.
 */
export async function sendWhatsApp<T extends TemplateName>(
  to: string,
  template: T,
  params: TemplateParams[T],
  options: SendWhatsAppOptions
): Promise<SendWhatsAppResult> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !accessToken) {
    const err = "WhatsApp not configured. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN."
    const msg = renderTemplate(template, params)
    await logNotification(options.schoolId, to, template, msg, "failed", err, options.targetUserId)
    return { success: false, error: err }
  }

  const messageText = renderTemplate(template, params)
  const apiParams = getTemplateParamsForApi(template, params)

  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: toE164(to).replace(/^\+/, ""), // E.164 without + e.g. 919876543210
    type: "template",
    template: {
      name: template.toLowerCase(),
      language: { code: "mr" },
      components: [
        {
          type: "body",
          parameters: apiParams.map((text) => ({ type: "text", text })),
        },
      ],
    },
  }

  try {
    const res = await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = (await res.json()) as { messages?: Array<{ id: string }>; error?: { message: string } }

    if (!res.ok) {
      const errMsg = data.error?.message || `HTTP ${res.status}`
      await logNotification(options.schoolId, to, template, messageText, "failed", errMsg, options.targetUserId)
      return { success: false, error: errMsg }
    }

    const messageId = data.messages?.[0]?.id
    await logNotification(options.schoolId, to, template, messageText, "sent", undefined, options.targetUserId)
    return { success: true, messageId }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error"
    const msg = renderTemplate(template, params)
    await logNotification(options.schoolId, to, template, msg, "failed", errMsg, options.targetUserId)
    return { success: false, error: errMsg }
  }
}

/**
 * Log sent/failed notification to Supabase.
 */
async function logNotification(
  schoolId: string,
  recipientPhone: string,
  templateName: string,
  messageText: string,
  status: "sent" | "failed",
  errorMessage?: string,
  targetUserId?: string | null
): Promise<void> {
  try {
    const admin = createAdminClient()
    await admin.from("notifications").insert({
      school_id: schoolId,
      title: templateName,
      message: messageText,
      type: "whatsapp",
      sent_to: "individual",
      status,
      sent_at: status === "sent" ? new Date().toISOString() : null,
      target_user_id: targetUserId || null,
      recipient_phone: recipientPhone,
      meta: errorMessage ? { error: errorMessage } : null,
    })
  } catch (e) {
    console.error("Failed to log notification:", e)
  }
}
