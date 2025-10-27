"use client"

import React, { useState } from "react"
import {
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  Settings,
  Move,
  FileText,
  ImageIcon,
  List,
} from "lucide-react"
import type { FormSection, FormField, FormGroup } from "./types"

/**
 * Utility helpers
 */
const uid = (prefix = "") => `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const cloneGroup = (g: FormGroup): FormGroup => ({
  ...g,
  id: uid("g-"),
  fields: g.fields.map((f) => ({ ...f, id: uid("f-") })),
})

interface FormCanvasProps {
  sections: FormSection[]
  selectedSectionId: string | null
  selectedGroupId: string | null
  selectedFieldId: string | null
  onSelectSection: (id: string | null) => void
  onSelectGroup: (id: string | null) => void
  onSelectField: (id: string | null) => void
  onUpdateSections: (sections: FormSection[]) => void
  groupsOnly?: boolean
}

/**
 * FormCanvas component for rendering and editing form sections/groups/fields.
 */
export default function FormCanvas({
  sections,
  selectedSectionId,
  selectedGroupId,
  selectedFieldId,
  onSelectSection,
  onSelectGroup,
  onSelectField,
  onUpdateSections,
  groupsOnly = false,
}: FormCanvasProps) {
  // Get the current section (assuming groupsOnly means we work with the selected section's groups)
  const currentSection = selectedSectionId ? sections.find(s => s.id === selectedSectionId) : sections[0]
  const groups = currentSection?.groups || []

  // collapsed state for groups
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  // drag state: indicates what's being dragged and origin
  const [dragging, setDragging] = useState<
    | {
        type: "group"
        groupId: string
      }
    | {
        type: "field"
        fieldId: string
        fromGroupId: string
      }
    | null
  >(null)

  // drag over target indicator (groupId + optional fieldId for insertion before)
  const [dragOver, setDragOver] = useState<{ groupId?: string; beforeFieldId?: string | null } | null>(null)

  /* ---------------- handlers ---------------- */

  const toggleCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  const addGroup = (indexAfter?: number) => {
    const newGroup: FormGroup = { id: uid("g-"), title: "Group Title", required: false, fields: [] }
    const updatedGroups = [...groups]
    if (indexAfter === undefined) updatedGroups.push(newGroup)
    else updatedGroups.splice(indexAfter + 1, 0, newGroup)
    updateSectionsWithGroups(updatedGroups)
  }

  const deleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter((g) => g.id !== groupId)
    updateSectionsWithGroups(updatedGroups)
  }

  const copyGroup = (groupId: string) => {
    const source = groups.find((g) => g.id === groupId)
    if (!source) return
    const cloned = cloneGroup(source)
    const idx = groups.findIndex((g) => g.id === groupId)
    const updatedGroups = [...groups]
    updatedGroups.splice(idx + 1, 0, cloned)
    updateSectionsWithGroups(updatedGroups)
  }

  const updateGroupTitle = (groupId: string, value: string) => {
    const updatedGroups = groups.map((g) => (g.id === groupId ? { ...g, title: value } : g))
    updateSectionsWithGroups(updatedGroups)
  }

  const toggleGroupRequired = (groupId: string, value: boolean) => {
    const updatedGroups = groups.map((g) => (g.id === groupId ? { ...g, required: value } : g))
    updateSectionsWithGroups(updatedGroups)
  }

  const addFieldToGroup = (groupId: string, field?: Partial<FormField>) => {
    const newField: FormField = {
      id: uid("f-"),
      type: field?.type || "text",
      label: field?.label || "Untitled",
      placeholder: field?.placeholder,
      options: field?.options,
      required: field?.required || false,
      fullWidth: field?.fullWidth || false,
    }
    const updatedGroups = groups.map((g) => (g.id === groupId ? { ...g, fields: [...g.fields, newField] } : g))
    updateSectionsWithGroups(updatedGroups)
  }

  const deleteField = (groupId: string, fieldId: string) => {
    const updatedGroups = groups.map((g) => (g.id === groupId ? { ...g, fields: g.fields.filter((f) => f.id !== fieldId) } : g))
    updateSectionsWithGroups(updatedGroups)
  }

  const toggleFieldRequired = (groupId: string, fieldId: string, value: boolean) => {
    const updatedGroups = groups.map((g) =>
      g.id === groupId ? { ...g, fields: g.fields.map((f) => (f.id === fieldId ? { ...f, required: value } : f)) } : g
    )
    updateSectionsWithGroups(updatedGroups)
  }

  const updateSectionsWithGroups = (updatedGroups: FormGroup[]) => {
    if (!currentSection) return
    const updatedSections = sections.map(s => s.id === currentSection.id ? { ...s, groups: updatedGroups } : s)
    onUpdateSections(updatedSections)
  }

  /* ---------------- drag & drop (groups) ---------------- */

  const onGroupDragStart = (e: React.DragEvent, groupId: string) => {
    try {
      e.dataTransfer.setData("application/x-builder", JSON.stringify({ type: "group", groupId }))
      e.dataTransfer.effectAllowed = "move"
    } catch {}
    setDragging({ type: "group", groupId })
  }

  const onGroupDragOver = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault()
    // we show target group but no before field
    setDragOver({ groupId: targetGroupId, beforeFieldId: null })
  }

  const onGroupDrop = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault()
    if (!dragging) return
    if (dragging.type !== "group") {
      setDragging(null)
      setDragOver(null)
      return
    }
    if (dragging.groupId === targetGroupId) {
      setDragging(null)
      setDragOver(null)
      return
    }
    const fromIndex = groups.findIndex((g) => g.id === dragging.groupId)
    const toIndex = groups.findIndex((g) => g.id === targetGroupId)
    if (fromIndex === -1 || toIndex === -1) {
      setDragging(null)
      setDragOver(null)
      return
    }
    const updatedGroups = [...groups]
    const [moved] = updatedGroups.splice(fromIndex, 1)
    // insert after the target (mimics the screenshot flow)
    updatedGroups.splice(toIndex + (toIndex > fromIndex ? 0 : 1), 0, moved)
    updateSectionsWithGroups(updatedGroups)
    setDragging(null)
    setDragOver(null)
  }

  /* ---------------- drag & drop (fields) ---------------- */

  const onFieldDragStart = (e: React.DragEvent, fromGroupId: string, fieldId: string) => {
    e.stopPropagation()
    try {
      e.dataTransfer.setData("application/x-builder", JSON.stringify({ type: "field", fromGroupId, fieldId }))
      e.dataTransfer.effectAllowed = "move"
    } catch {}
    setDragging({ type: "field", fromGroupId, fieldId })
  }

  const onFieldDragOver = (e: React.DragEvent, targetGroupId: string, beforeFieldId?: string | null) => {
    e.preventDefault()
    setDragOver({ groupId: targetGroupId, beforeFieldId: beforeFieldId ?? null })
  }

  const onFieldDrop = (e: React.DragEvent, targetGroupId: string, beforeFieldId?: string | null) => {
    e.preventDefault()

    // Check if we're dropping an element from the sidebar
    const elementType = e.dataTransfer.getData("elementType")
    if (elementType) {
      // Adding new element from sidebar
      const newField: FormField = {
        id: uid("f-"),
        type: elementType as FormField["type"],
        label: elementType.charAt(0).toUpperCase() + elementType.slice(1) + " Field",
        placeholder: "",
        required: false,
        fullWidth: false,
      }
      const insertIdx = beforeFieldId ? Math.max(0, groups.find(g => g.id === targetGroupId)?.fields.findIndex((f) => f.id === beforeFieldId) || 0) : groups.find(g => g.id === targetGroupId)?.fields.length || 0
      const updatedGroups = groups.map((g) =>
        g.id === targetGroupId
          ? { ...g, fields: [...g.fields.slice(0, insertIdx), newField, ...g.fields.slice(insertIdx)] }
          : g
      )
      updateSectionsWithGroups(updatedGroups)
      setDragging(null)
      setDragOver(null)
      return
    }

    // Handle moving existing fields
    if (!dragging || dragging.type !== "field") {
      setDragging(null)
      setDragOver(null)
      return
    }
    const { fieldId, fromGroupId } = dragging
    if (!fieldId || !fromGroupId) {
      setDragging(null)
      setDragOver(null)
      return
    }
    // remove from source
    const groupsCopy = groups.map((g) => ({ ...g, fields: [...g.fields] }))
    const srcGroup = groupsCopy.find((g) => g.id === fromGroupId)
    const targetGroup = groupsCopy.find((g) => g.id === targetGroupId)
    if (!srcGroup || !targetGroup) {
      setDragging(null)
      setDragOver(null)
      return
    }
    const fieldIndex = srcGroup.fields.findIndex((f) => f.id === fieldId)
    if (fieldIndex === -1) {
      setDragging(null)
      setDragOver(null)
      return
    }
    const [movedField] = srcGroup.fields.splice(fieldIndex, 1)
    // if moving within same group and beforeFieldId is right after removal, handle indexes
    if (fromGroupId === targetGroupId) {
      // determine insertion index
      const insertIdx = beforeFieldId ? Math.max(0, targetGroup.fields.findIndex((f) => f.id === beforeFieldId)) : targetGroup.fields.length
      targetGroup.fields.splice(insertIdx, 0, movedField)
    } else {
      const insertIdx = beforeFieldId ? Math.max(0, targetGroup.fields.findIndex((f) => f.id === beforeFieldId)) : targetGroup.fields.length
      targetGroup.fields.splice(insertIdx, 0, movedField)
    }
    // commit
    updateSectionsWithGroups(groupsCopy)
    setDragging(null)
    setDragOver(null)
  }

  /* ---------------- UI Rendering Helpers ---------------- */

  const renderFieldInputPreview = (f: FormField) => {
    switch (f.type) {
      case "textarea":
        return <textarea className="w-full h-20 rounded-md bg-white border border-gray-200 px-3 py-2 text-sm resize-none" placeholder={f.placeholder ?? ""} disabled />
      case "text":
      case "email":
      case "phone":
      case "number":
      case "url":
      case "password":
        return <input type={f.type} className="w-full h-10 rounded-md bg-white border border-gray-200 px-3 text-sm" placeholder={f.placeholder ?? ""} disabled />
      case "select":
        return (
          <select className="w-full h-10 rounded-md bg-white border border-gray-200 px-3 text-sm" disabled>
            {f.options?.length ? f.options.map((o) => <option key={o}>{o}</option>) : <option>Option</option>}
          </select>
        )
      case "radio":
        return (
          <div className="space-y-2">
            {f.options?.map((o) => (
              <label key={o} className="flex items-center gap-2 text-sm">
                <input type="radio" name={`r-${f.id}`} disabled />
                <span className="text-sm text-gray-600">{o}</span>
              </label>
            ))}
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            {f.options?.map((o) => (
              <label key={o} className="flex items-center gap-2 text-sm">
                <input type="checkbox" disabled />
                <span className="text-sm text-gray-600">{o}</span>
              </label>
            ))}
          </div>
        )
      case "date":
        return <input type="date" className="w-full h-10 rounded-md bg-white border border-gray-200 px-3 text-sm" disabled />
      case "file":
        return (
          <div className="border border-dashed rounded-md p-6 text-center text-gray-400 text-sm bg-white">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-6 h-6 text-gray-400" />
              <div>Drag your image to start uploading</div>
              <div className="text-xs text-gray-400">JPEG, PNG and GIF formats</div>
              <button className="mt-2 inline-block px-3 py-1 border rounded bg-white text-sm">Browse files</button>
            </div>
          </div>
        )
      default:
        return <input className="w-full h-10 rounded-md bg-white border border-gray-200 px-3 text-sm" disabled />
    }
  }

  /* ---------------- Layout ---------------- */

  return (
    <div className="h-full bg-gray-50 p-8 overflow-hidden">
      <div className="max-w-4xl mx-auto h-full">
        {/* Top helper label like your screenshot (optional) */}
        <div className="mb-6 text-center">
          <div className="inline-block bg-white shadow rounded px-4 py-2 text-sm text-gray-600">{currentSection?.title || "Section Title Here..."}</div>
        </div>

        {/* Groups flow (no section wrapper) */}
        <div className="space-y-6">
          {groups.map((group, gIndex) => {
            const isCollapsed = collapsedGroups.has(group.id)
            const dropHighlight = dragOver?.groupId === group.id

            return (
              <div key={group.id} className="relative">
                {/* group card */}
                <div
                  draggable
                  onDragStart={(e) => onGroupDragStart(e, group.id)}
                  onDragOver={(e) => onGroupDragOver(e, group.id)}
                  onDrop={(e) => onGroupDrop(e, group.id)}
                  className={`rounded-lg border ${dropHighlight ? "border-[#009689] shadow-md" : "border-[#009689]"} bg-white`}
                >
                  {/* header */}
                  <div className="flex items-center justify-between bg-emerald-50 border-b border-emerald-100 px-3 py-2 rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                      <input
                        className="bg-transparent text-sm font-medium text-gray-700 outline-none"
                        value={group.title}
                        onChange={(e) => updateGroupTitle(group.id, e.target.value)}
                        onBlur={() => {
                          // Auto-save when user finishes editing group title
                          const updatedGroups = groups.map((g) =>
                            g.id === group.id ? { ...g, title: g.title } : g
                          )
                          const updatedSections = sections.map(s => s.id === currentSection?.id ? { ...s, groups: updatedGroups } : s)
                          // Trigger auto-save
                          setTimeout(() => {
                            // This will be handled by the parent component's auto-save
                          }, 0)
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={!!group.required}
                          onChange={(e) => toggleGroupRequired(group.id, e.target.checked)}
                        />
                        <span className="text-xs">Required</span>
                      </label>

                      <button
                        onClick={() => toggleCollapse(group.id)}
                        className="text-gray-600 p-1 rounded hover:bg-gray-100"
                        title={isCollapsed ? "Expand group" : "Collapse group"}
                      >
                        {isCollapsed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button title="Copy group" className="text-gray-600 p-1 rounded hover:bg-gray-100" onClick={() => copyGroup(group.id)}>
                        <Copy className="w-4 h-4" />
                      </button>

                      <button title="Settings" className="text-gray-600 p-1 rounded hover:bg-gray-100">
                        <Settings className="w-4 h-4" />
                      </button>

                      <button title="Delete group" className="text-gray-600 p-1 rounded hover:bg-red-50" onClick={() => deleteGroup(group.id)}>
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* dotted area + fields */}
                  <div className="px-4 py-4">
                    {/* grid/dotted background area when empty */}
                    {isCollapsed ? (
                      <div className="py-6 text-sm text-gray-500"></div>
                    ) : (
                      <div
                        className="space-y-4"
                        /* accept drag over the group area; drop here to append at end */
                        onDragOver={(e) => onFieldDragOver(e, group.id, null)}
                        onDrop={(e) => onFieldDrop(e, group.id, null)}
                      >
                        {/* fields */}
                        {group.fields.length === 0 ? (
                          <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-gray-400">
                            <div className="text-sm">Drop fields here...</div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Group fields in pairs when not full width */}
                            {(() => {
                              const fields = group.fields
                              const fieldPairs: FormField[][] = []

                              for (let i = 0; i < fields.length; i++) {
                                const field = fields[i]
                                if (field.fullWidth) {
                                  // Full width field takes its own row
                                  fieldPairs.push([field])
                                } else {
                                  // Check if we can pair with next field
                                  const nextField = fields[i + 1]
                                  if (nextField && !nextField.fullWidth) {
                                    fieldPairs.push([field, nextField])
                                    i++ // Skip next field as it's paired
                                  } else {
                                    fieldPairs.push([field])
                                  }
                                }
                              }

                              return fieldPairs.map((pair, pairIndex) => (
                                <div key={`pair-${pairIndex}`} className="space-y-4">
                                  {pair.map((field) => {
                                    const beforeFieldId = dragOver?.beforeFieldId
                                    const showInsertAbove = dragOver?.groupId === group.id && dragOver?.beforeFieldId === field.id
                                    const isFullWidth = field.fullWidth || pair.length === 1

                                    return (
                                      <div key={field.id} className={`relative ${isFullWidth ? '' : 'inline-block w-1/2 pr-2'}`}>
                                        {/* insert marker above when dragging over */}
                                        {showInsertAbove && <div className="h-2 -mt-2 flex justify-center"><div className="w-11/12 h-0.5 bg-teal-400 rounded" /></div>}

                                        <div
                                          draggable
                                          onDragStart={(e) => {
                                            onFieldDragStart(e, group.id, field.id)
                                          }}
                                          onDragOver={(e) => onFieldDragOver(e, group.id, field.id)}
                                          onDrop={(e) => onFieldDrop(e, group.id, field.id)}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            onSelectField(field.id)
                                          }}
                                          className={`rounded-md border bg-white p-4 flex items-start gap-4 cursor-pointer transition-colors ${
                                            selectedFieldId === field.id ? "border-teal-400 shadow-sm" : "border-gray-200 hover:border-gray-300"
                                          } ${isFullWidth ? '' : 'mb-4'}`}
                                        >
                                          <div className="pt-1">
                                            <GripVertical className="w-4 h-4 text-gray-300" />
                                          </div>

                                          <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                              <div className="text-sm font-medium text-gray-700">{field.label}</div>
                                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-[11px]">Full</span>
                                                  <input
                                                    type="checkbox"
                                                    className="w-4 h-4"
                                                    checked={!!field.fullWidth}
                                                    onChange={(e) => {
                                                      const updatedGroups = groups.map((g) =>
                                                        g.id === group.id ? { ...g, fields: g.fields.map((f) =>
                                                          f.id === field.id ? { ...f, fullWidth: e.target.checked } : f
                                                        ) } : g
                                                      )
                                                      updateSectionsWithGroups(updatedGroups)
                                                    }}
                                                  />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-[11px]">Required</span>
                                                  <input
                                                    type="checkbox"
                                                    className="w-4 h-4"
                                                    checked={!!field.required}
                                                    onChange={(e) => toggleFieldRequired(group.id, field.id, e.target.checked)}
                                                  />
                                                </div>
                                                <button title="More" className="p-1 rounded hover:bg-gray-100"><List className="w-4 h-4" /></button>
                                              </div>
                                            </div>

                                            <div className="mt-3">{renderFieldInputPreview(field)}</div>
                                          </div>

                                          <div className="flex flex-col gap-2">
                                            <button title="Delete field" onClick={() => deleteField(group.id, field.id)} className="text-gray-500 hover:text-red-600">
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              ))
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* connector + plus icon between groups (mimic screenshot connector) */}
                <div className="flex items-center justify-center -mt-2">
                  <div className="bg-white rounded-full border border-gray-200 p-1">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-blue-100 text-blue-500">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* add group final button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => addGroup()}
              className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-lg"
              title="Add Group"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* End block */}
          <div className="flex justify-center mt-6">
            <div className="w-56 text-center py-2 rounded-md border bg-gray-50 text-gray-600">End</div>
          </div>
        </div>
      </div>
    </div>
  )
}
