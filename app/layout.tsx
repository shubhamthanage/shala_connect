import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { LoginSuccessToast } from "@/components/auth/LoginSuccessToast"

export const metadata: Metadata = {
  title: "Shala Connect",
  description: "शाळाConnect — Connect with your school community",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mr" className="scroll-smooth">
      <body className="font-sans antialiased min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-saffron focus:text-white focus:rounded-lg focus:font-semibold focus:outline-none"
        >
          मुख्य सामग्रीवर जा
        </a>
        <div id="main-content">{children}</div>
        <LoginSuccessToast />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--cream)",
              color: "var(--text-900)",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "var(--sh-md)",
            },
            success: {
              iconTheme: { primary: "var(--green-mid)", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "var(--saffron)", secondary: "white" },
            },
          }}
        />
      </body>
    </html>
  )
}
