"use client"

import { useAuth } from "@/lib/auth-context"
import { AuthPage } from "@/components/auth/auth-page"
import { FormBuilderPage } from "@/components/form-builder/form-builder-page"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <main className="min-h-screen bg-background">{isAuthenticated ? <FormBuilderPage /> : <AuthPage />}</main>
}
