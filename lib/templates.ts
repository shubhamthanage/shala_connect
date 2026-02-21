/**
 * Marathi message templates for WhatsApp notifications.
 * Template names must match pre-approved templates in Meta Business Manager.
 * See: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates
 */

export type TemplateName =
  | "ATTENDANCE_ABSENT"
  | "FEE_REMINDER"
  | "EXAM_REMINDER"
  | "RESULT_PUBLISHED"

export interface TemplateParams {
  ATTENDANCE_ABSENT: {
    school_name: string
    student_name: string
    class: string
    date: string
    time: string
  }
  FEE_REMINDER: {
    school_name: string
    parent_name: string
    student_name: string
    fee_type: string
    amount: string | number
    due_date: string
    payment_link: string
  }
  EXAM_REMINDER: {
    school_name: string
    student_name: string
    exam_name: string
    subject: string
    time: string
  }
  RESULT_PUBLISHED: {
    student_name: string
    exam_name: string
    marks: string | number
    total: string | number
    percentage: string | number
  }
}

const TEMPLATES: Record<
  TemplateName,
  (params: TemplateParams[TemplateName]) => string
> = {
  ATTENDANCE_ABSENT: (p) => {
    const q = p as TemplateParams["ATTENDANCE_ABSENT"]
    return `🏫 ${q.school_name}
प्रिय पालक,
आपला/आपली वार्ड *${q.student_name} (${q.class})* आज गैरहजर आहे.
📅 ${q.date} | ⏰ ${q.time}
शाळाConnect`
  },

  FEE_REMINDER: (p) => {
    const q = p as TemplateParams["FEE_REMINDER"]
    return `💰 ${q.school_name}
प्रिय ${q.parent_name},
${q.student_name} चे ${q.fee_type} शुल्क ₹${q.amount} थकित आहे.
शेवटची तारीख: ${q.due_date}
ऑनलाईन भरा: ${q.payment_link}
शाळाConnect`
  },

  EXAM_REMINDER: (p) => {
    const q = p as TemplateParams["EXAM_REMINDER"]
    return `📝 ${q.school_name}
${q.student_name} ला ${q.exam_name} उद्या आहे.
विषय: ${q.subject} | वेळ: ${q.time}
शाळाConnect`
  },

  RESULT_PUBLISHED: (p) => {
    const q = p as TemplateParams["RESULT_PUBLISHED"]
    return `🎉 ${q.student_name} चा निकाल जाहीर!
${q.exam_name}: ${q.marks}/${q.total} (${q.percentage}%)
शाळाConnect`
  },
}

/**
 * Renders a template with the given params.
 * Returns the final message text (for logging and for text-based send).
 */
export function renderTemplate<T extends TemplateName>(
  template: T,
  params: TemplateParams[T]
): string {
  return TEMPLATES[template](params as TemplateParams[T])
}

/**
 * Returns ordered parameter values for WhatsApp Cloud API template components.
 * Meta templates use {{1}}, {{2}}, etc. — params must match that order.
 */
export function getTemplateParamsForApi<T extends TemplateName>(
  template: T,
  params: TemplateParams[T]
): string[] {
  switch (template) {
    case "ATTENDANCE_ABSENT": {
      const p = params as TemplateParams["ATTENDANCE_ABSENT"]
      return [p.school_name, p.student_name, p.class, p.date, p.time]
    }
    case "FEE_REMINDER": {
      const p = params as TemplateParams["FEE_REMINDER"]
      return [
        p.school_name,
        p.parent_name,
        p.student_name,
        p.fee_type,
        String(p.amount),
        p.due_date,
        p.payment_link,
      ]
    }
    case "EXAM_REMINDER": {
      const p = params as TemplateParams["EXAM_REMINDER"]
      return [p.school_name, p.student_name, p.exam_name, p.subject, p.time]
    }
    case "RESULT_PUBLISHED": {
      const p = params as TemplateParams["RESULT_PUBLISHED"]
      return [
        p.student_name,
        p.exam_name,
        String(p.marks),
        String(p.total),
        String(p.percentage),
      ]
    }
    default:
      return []
  }
}
