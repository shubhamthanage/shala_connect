import { Suspense } from "react"
import LoginForm from "./LoginForm"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050F1E] flex items-center justify-center">
          <div className="text-white font-body text-lg">
            लोड होत आहे...
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
