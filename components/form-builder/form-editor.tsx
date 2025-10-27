"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Save, MoreVertical, Download, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import FormCanvas from "./form-canvas"
import { SectionsOverview } from "./sections-overview"
import { SectionSidebar } from "./section-sidebar"
import { ElementsSidebar } from "./elements-sidebar"
import { PropertiesSidebar } from "./properties-sidebar"
import { TopTabs } from "./top-tabs"
import type { FormSection, FormField } from "./types"

interface FormEditorProps {
  formId: string
  onBack: () => void
  onSave: () => void
}

export function FormEditor({ formId, onBack, onSave }: FormEditorProps) {
  const { toast } = useToast()
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formId_, setFormId_] = useState("")
  const [sections, setSections] = useState<FormSection[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("builder")
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [history, setHistory] = useState<{ past: FormSection[][]; future: FormSection[][] }>({ past: [], future: [] })
  const [zoom, setZoom] = useState<number>(100)
  const [viewMode, setViewMode] = useState<"overview" | "builder">("overview")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedData, setLastSavedData] = useState<string>("")

  useEffect(() => {
    loadForm()
  }, [formId])

  // Auto-scroll to selected section when it changes
  useEffect(() => {
    if (selectedSectionId) {
      const el = document.getElementById(`section-${selectedSectionId}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [selectedSectionId])

  useEffect(() => {
    if (selectedGroupId) {
      const el = document.getElementById(`group-${selectedGroupId}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [selectedGroupId])

  const loadForm = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getForm(formId)
      if (response.success && response.data) {
        const form = response.data
        setFormTitle(form.title)
        setFormId_(form.id)
        const structure = typeof form.structure === "string" ? JSON.parse(form.structure) : form.structure
        const loaded = structure.sections || []
        setSections(loaded)
        setHistory({ past: [], future: [] })
        setSelectedSectionId(loaded[0]?.id ?? null)
        setSelectedGroupId(loaded[0]?.groups?.[0]?.id ?? null)
        setSelectedFieldId(null)
        setViewMode("overview") // Always start in overview mode
        // Store initial state for change detection
        setLastSavedData(JSON.stringify({ title: form.title, structure: structure }))
        setHasUnsavedChanges(false)
      }
    } catch (err) {
      console.error("Failed to load form:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSection = () => {
    const newSection: FormSection = {
      id: Date.now().toString(),
      title: `Section ${sections.length + 1}`,
      groups: [],
    }
    const next = [...sections, newSection]
    applySections(next)
    setSelectedSectionId(newSection.id)
    setSelectedGroupId(null)
    // Stay in current view mode (overview or builder)
  }

  const handleCopySection = (section: FormSection) => {
    // Create a deep copy with new unique IDs
    const timestamp = Date.now();
    const newSection: FormSection = {
      ...section,
      id: `section-${timestamp}-${Math.random().toString(36).substr(2, 8)}`,
      title: `${section.title} (Copy)`,
      groups: section.groups.map(group => ({
        ...group,
        id: `group-${timestamp}-${Math.random().toString(36).substr(2, 8)}`,
        fields: (group.fields || []).map(field => ({
          ...field,
          id: `field-${timestamp}-${Math.random().toString(36).substr(2, 8)}`
        }))
      }))
    };
    
    const updatedSections = [...sections, newSection];
    applySections(updatedSections);
    setSelectedSectionId(newSection.id);
    setSelectedGroupId(newSection.groups[0]?.id || null);
    setSelectedFieldId(null);

    // Switch to builder view with the new section
    setViewMode("builder");
  };

  const handleSaveForm = async () => {
    setSaving(true)
    try {
      await apiClient.updateForm(formId, formTitle, "", { sections })
      // Update last saved data and mark as saved
      setLastSavedData(JSON.stringify({ title: formTitle, structure: { sections } }))
      setHasUnsavedChanges(false)
      toast({
        title: "Success",
        description: "Form saved successfully!",
      })
      onSave()
    } catch (err) {
      console.error("Failed to save form:", err)
      toast({
        title: "Error",
        description: "Failed to save form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const autoSave = async (title?: string, sectionsData?: FormSection[]) => {
    try {
      const titleToSave = title || formTitle
      const sectionsToSave = sectionsData || sections
      await apiClient.updateForm(formId, titleToSave, "", { sections: sectionsToSave })
      setLastSavedData(JSON.stringify({ title: titleToSave, structure: { sections: sectionsToSave } }))
      setHasUnsavedChanges(false)
    } catch (err) {
      console.error("Auto-save failed:", err)
    }
  }

  // History helpers
  const applySections = (next: FormSection[]) => {
    setHistory((h) => ({ past: [...h.past, sections], future: [] }))
    setSections(next)
    checkForChanges(formTitle, next)
  }

  const checkForChanges = (title: string, sectionsData: FormSection[]) => {
    const currentData = JSON.stringify({ title, structure: { sections: sectionsData } })
    const hasChanges = currentData !== lastSavedData
    setHasUnsavedChanges(hasChanges)
  }

  const undo = () => {
    setHistory((h) => {
      if (h.past.length === 0) return h
      const previous = h.past[h.past.length - 1]
      const newPast = h.past.slice(0, -1)
      const newFuture = [sections, ...h.future]
      setSections(previous)
      return { past: newPast, future: newFuture }
    })
  }

  const redo = () => {
    setHistory((h) => {
      if (h.future.length === 0) return h
      const [next, ...rest] = h.future
      const newPast = [...h.past, sections]
      setSections(next)
      return { past: newPast, future: rest }
    })
  }

  const handleUpdateSections = (next: FormSection[]) => {
    applySections(next)
  }

  // Sidebar group navigation handlers
  const currentSection = selectedSectionId
    ? sections.find((s) => s.id === selectedSectionId) || sections[0]
    : sections[0]

  // Find selected field for properties sidebar
  const selectedField = selectedFieldId ? (() => {
    for (const section of sections) {
      for (const group of section.groups) {
        const field = group.fields.find(f => f.id === selectedFieldId)
        if (field) return field
      }
    }
    return null
  })() : null

  const handleUpdateField = (updates: Partial<FormField>) => {
    if (!selectedFieldId) return

    const updatedSections = sections.map(section => ({
      ...section,
      groups: section.groups.map(group => ({
        ...group,
        fields: group.fields.map(field =>
          field.id === selectedFieldId ? { ...field, ...updates } : field
        )
      }))
    }))

    handleUpdateSections(updatedSections)
  }

  const handleDeleteField = () => {
    if (!selectedFieldId) return

    const updatedSections = sections.map(section => ({
      ...section,
      groups: section.groups.map(group => ({
        ...group,
        fields: group.fields.filter(field => field.id !== selectedFieldId)
      }))
    }))

    handleUpdateSections(updatedSections)
    setSelectedFieldId(null)
  }

  const goHome = () => {
    if (currentSection && currentSection.groups.length > 0) setSelectedGroupId(currentSection.groups[0].id)
  }

  const navigateUp = () => {
    if (!currentSection || currentSection.groups.length === 0) return
    const idx = selectedGroupId ? currentSection.groups.findIndex((g) => g.id === selectedGroupId) : 0
    if (idx > 0) setSelectedGroupId(currentSection.groups[idx - 1].id)
  }

  const navigateDown = () => {
    if (!currentSection || currentSection.groups.length === 0) return
    const idx = selectedGroupId ? currentSection.groups.findIndex((g) => g.id === selectedGroupId) : -1
    if (idx < currentSection.groups.length - 1) setSelectedGroupId(currentSection.groups[idx + 1].id)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-white">
      <SectionSidebar
        groups={currentSection?.groups || []}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        onAddSection={handleAddSection}
        onUndo={undo}
        onRedo={redo}
        zoom={zoom}
        onZoom={setZoom}
        onHome={goHome}
        onNavigateUp={navigateUp}
        onNavigateDown={navigateDown}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-white px-6 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-gray-600">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <input
                className="text-lg font-semibold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-teal-500"
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value)
                  checkForChanges(e.target.value, sections)
                }}
                onBlur={() => autoSave(formTitle)}
              />
              <p className="text-xs text-gray-500"></p>
            </div>
          </div>
         
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => {}}>
              <Download className="w-4 h-4" />
              Import JSON
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => {}}>
              <Share2 className="w-4 h-4" />
              Publish
            </Button>
            <Button
              onClick={handleSaveForm}
              size="sm"
              className={`gap-2 text-white transition-colors ${
                hasUnsavedChanges
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
              }`}
              disabled={saving || !hasUnsavedChanges}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : hasUnsavedChanges ? "Save Changes" : "Saved"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {}}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TopTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-8" style={{ scrollbarWidth: 'thin', scrollbarColor: '#009689 #f1f1f1' }}>
          <div className="max-w-6xl mx-auto" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}>
            {activeTab === "builder" && (
              <>
                {viewMode === "overview" ? (
                  <SectionsOverview
                    sections={sections}
                    onAddSection={handleAddSection}
                    onSelectSection={(id) => {
                      setSelectedSectionId(id)
                      const sec = sections.find((s) => s.id === id)
                      setSelectedGroupId(sec?.groups?.[0]?.id ?? null)
                      setViewMode("builder")
                    }}
                    onCopySection={handleCopySection}
                    onDeleteSection={(id) => {
                      const updatedSections = sections.filter(s => s.id !== id)
                      handleUpdateSections(updatedSections)
                      if (selectedSectionId === id) {
                        setSelectedSectionId(updatedSections[0]?.id ?? null)
                        setSelectedGroupId(updatedSections[0]?.groups?.[0]?.id ?? null)
                      }
                    }}
                  />
                ) : (
                  <>
                    <FormCanvas
                      sections={sections}
                      selectedSectionId={selectedSectionId}
                      selectedGroupId={selectedGroupId}
                      selectedFieldId={selectedFieldId}
                      onSelectSection={setSelectedSectionId}
                      onSelectGroup={setSelectedGroupId}
                      onSelectField={setSelectedFieldId}
                      onUpdateSections={handleUpdateSections}
                      groupsOnly
                    />
                    {sections.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No sections yet. Add your first section to get started!</p>
                        <Button onClick={handleAddSection} className="gap-2 bg-teal-600 hover:bg-teal-700">
                          <Plus className="w-4 h-4" />
                          Add Section
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <ElementsSidebar onDragStart={setDraggedElement} onDragEnd={() => setDraggedElement(null)} />

      <PropertiesSidebar
        selectedField={selectedField}
        onUpdateField={handleUpdateField}
        onDeleteField={handleDeleteField}
      />
    </div>
  )
}
