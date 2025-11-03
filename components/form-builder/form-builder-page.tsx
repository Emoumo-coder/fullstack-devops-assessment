"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { apiClient, type Form } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { FormList } from "./form-list"
import { FormEditor } from "./form-editor"
import { User, LogOut, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FormBuilderPage() {
  const { logout, user } = useAuth()
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getForms()
      if (response.success && response.data) {
        setForms(response.data)
      }
    } catch (err) {
      console.error("Failed to load forms:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const handleCreateForm = async (title: string, description: string) => {
    try {
      const response = await apiClient.createForm(title, description, { sections: [] })
      if (response.success && response.data) {
        setForms([response.data, ...forms])
        setSelectedFormId(response.data.id.toString())
      }
    } catch (err) {
      console.error("Failed to create form:", err)
    }
  }

  const handleDeleteForm = async (id: string) => {
    try {
      await apiClient.deleteForm(id)
      setForms(forms.filter((f) => f.id !== id))
    } catch (err) {
      console.error("Failed to delete form:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">Form Builder</h1>
            <p className="text-sm text-muted-foreground">Create and manage your custom forms</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name || 'User'}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {selectedFormId ? (
          <FormEditor formId={selectedFormId} onBack={() => setSelectedFormId(null)} onSave={() => loadForms()} />
        ) : (
          <FormList
            forms={forms}
            loading={loading}
            onSelectForm={setSelectedFormId}
            onCreateForm={handleCreateForm}
            onDeleteForm={handleDeleteForm}
          />
        )}
      </div>
    </div>
  )
}
