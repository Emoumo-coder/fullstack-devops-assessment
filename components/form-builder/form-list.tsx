"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit3, FileText } from "lucide-react"
import type { Form } from "@/lib/api-client"

interface FormListProps {
  forms: Form[]
  loading: boolean
  onSelectForm: (id: string) => void
  onCreateForm: (title: string, description: string) => void
  onDeleteForm: (id: string) => void
  onEditForm?: (id: string, title?: string, description?: string) => void
}

export function FormList({ forms, loading, onSelectForm, onCreateForm, onDeleteForm, onEditForm }: FormListProps) {
  const [showNewForm, setShowNewForm] = useState(false)
  const [newFormTitle, setNewFormTitle] = useState("")
  const [newFormDescription, setNewFormDescription] = useState("")
  const [editingForm, setEditingForm] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const handleCreateForm = () => {
    if (newFormTitle.trim()) {
      onCreateForm(newFormTitle, newFormDescription)
      setNewFormTitle("")
      setNewFormDescription("")
      setShowNewForm(false)
    }
  }

  const handleEditForm = (formId: string) => {
    const form = forms.find(f => f.id === formId)
    if (form) {
      setEditingForm(formId)
      setEditTitle(form.title)
      setEditDescription(form.description || "")
    }
  }

  const handleSaveEdit = () => {
    if (editingForm && onEditForm) {
      onEditForm(editingForm, editTitle, editDescription)
      setEditingForm(null)
      setEditTitle("")
      setEditDescription("")
    }
  }

  const handleCancelEdit = () => {
    setEditingForm(null)
    setEditTitle("")
    setEditDescription("")
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading forms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Your Forms</h2>
            <p className="text-sm text-muted-foreground">Manage and edit your forms</p>
          </div>
          <Button onClick={() => setShowNewForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Form
          </Button>
        </div>

        {showNewForm && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Create New Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Form Title</label>
                <Input
                  placeholder="e.g., Customer Feedback Form"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input
                  placeholder="Describe your form"
                  value={newFormDescription}
                  onChange={(e) => setNewFormDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateForm} size="sm">
                  Create
                </Button>
                <Button
                  onClick={() => {
                    setShowNewForm(false)
                    setNewFormTitle("")
                    setNewFormDescription("")
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {forms.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No forms yet. Create your first form to get started!</p>
              <Button onClick={() => setShowNewForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Form
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forms.map((form) => {
              const created = form.created_at ?? form.createdAt
              return (
              <Card key={form.id} className="hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-teal-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        {editingForm === form.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="text-lg font-semibold"
                              placeholder="Form title"
                            />
                            <Input
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Form description"
                            />
                          </div>
                        ) : (
                          <>
                            <h3 className="font-semibold text-gray-900 text-lg">{form.title}</h3>
                            {form.description && <p className="text-sm text-gray-600 mt-1">{form.description}</p>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {created && `Created ${new Date(created).toLocaleDateString()}`}
                    </div>
                    <div className="flex items-center gap-2">
                      {onEditForm && (
                        editingForm === form.id ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSaveEdit}
                              className="gap-1 bg-teal-600 hover:bg-teal-700 text-white"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="gap-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-gray-600 hover:text-teal-600 hover:border-teal-300"
                            onClick={() => handleEditForm(form.id)}
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </Button>
                        )
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                        onClick={() => onSelectForm(form.id)}
                      >
                        Open
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDeleteForm(form.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )})}
          </div>
        )}
      </div>
    </div>
  )
}
