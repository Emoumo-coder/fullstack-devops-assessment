"use client"

import { FieldEditor } from "./field-editor"
import type { FormField } from "./types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface PropertiesSidebarProps {
  selectedField: FormField | null
  onUpdateField: (updates: Partial<FormField>) => void
  onDeleteField: () => void
}

export function PropertiesSidebar({ selectedField, onUpdateField, onDeleteField }: PropertiesSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (isCollapsed) {
    return (
      <div className="w-8 bg-white border-l border-gray-200 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Show Properties"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    )
  }

  if (!selectedField) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Hide Properties"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500 text-center">
            Select a field to edit its properties
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Field Properties</h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Hide Properties"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <FieldEditor
          field={selectedField}
          onUpdate={onUpdateField}
          onDelete={onDeleteField}
        />
      </div>
    </div>
  )
}