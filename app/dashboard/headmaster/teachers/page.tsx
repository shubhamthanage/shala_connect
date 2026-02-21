import { redirect } from "next/navigation"
import { getHeadmasterSchoolId, getSchoolTeachers } from "@/app/actions/users"
import { EmptyState } from "@/components/ui/EmptyState"

export default async function TeachersPage() {
  const schoolId = await getHeadmasterSchoolId()
  if (!schoolId) redirect("/login")

  const teachers = await getSchoolTeachers(schoolId)

  return (
    <>
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="font-bold text-text-900 text-[17px] font-heading">
          👩‍🏫 शिक्षक व्यवस्थापन
        </div>
        <a
          href="/dashboard/headmaster/users/add"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-saffron-glow hover:shadow-saffron-hover font-body"
        >
          + शिक्षक जोडा
        </a>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="card-elevated overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border-school flex justify-between items-center">
            <span className="font-bold text-text-900 text-sm font-heading">
              शिक्षक यादी
            </span>
          </div>
          {teachers.length === 0 ? (
            <EmptyState
              icon="👩‍🏫"
              title="अजून शिक्षक नाहीत"
              description="वापरकर्ते जोडा पृष्ठावरून शिक्षक भूमिकेसह नवीन वापरकर्ता जोडा."
              actionLabel="वापरकर्ते जोडा"
              actionHref="/dashboard/headmaster/users/add"
            />
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    नाव
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    ईमेल
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    मोबाईल
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    स्थिती
                  </th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-saffron-pale/50">
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                      {t.name}
                    </td>
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                      {t.email ?? "—"}
                    </td>
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                      {t.phone ?? "—"}
                    </td>
                    <td className="text-xs px-4 py-2.5 border-b border-border-school">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          t.is_active ? "bg-green-pale text-green-mid" : "bg-red-50 text-red-500"
                        } font-body`}
                      >
                        {t.is_active ? "सक्रिय" : "निष्क्रिय"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
