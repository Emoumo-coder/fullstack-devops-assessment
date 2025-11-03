"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus, X, Type, Mail, Phone, Circle, Square, ChevronDown, Calendar, Paperclip, FileText, Hash, Link, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"

const AVAILABLE_ELEMENTS = [
  { id: "text", label: "Text Input", icon: Type, color: "text-blue-600" },
  { id: "email", label: "Email", icon: Mail, color: "text-green-600" },
  { id: "phone", label: "Phone Number", icon: Phone, color: "text-purple-600" },
  { id: "radio", label: "Radio Button", icon: Circle, color: "text-orange-600" },
  { id: "checkbox", label: "Checkbox", icon: Square, color: "text-red-600" },
  { id: "select", label: "Dropdown", icon: ChevronDown, color: "text-indigo-600" },
  { id: "date", label: "Date Picker", icon: Calendar, color: "text-pink-600" },
  { id: "file", label: "File Upload", icon: Paperclip, color: "text-yellow-600" },
  { id: "textarea", label: "Text Area", icon: FileText, color: "text-teal-600" },
  { id: "number", label: "Number", icon: Hash, color: "text-cyan-600" },
  { id: "url", label: "URL", icon: Link, color: "text-lime-600" },
  { id: "password", label: "Password", icon: Lock, color: "text-gray-600" },
]

interface ElementsSidebarProps {
  onDragStart: (elementId: string) => void
  onDragEnd: () => void
}

export function ElementsSidebar({ onDragStart, onDragEnd }: ElementsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(true)

  const filteredElements = AVAILABLE_ELEMENTS.filter((el) => el.label.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("elementType", elementId)
    onDragStart(elementId)
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-8 h-8 rounded-full bg-[#009689] hover:bg-[#007a7a] text-white flex items-center justify-center shadow-lg transition-colors"
            title="Add Element"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex items-center">
          <span className="text-xs text-gray-600 font-medium transform -rotate-90 whitespace-nowrap origin-center">
            Add Element
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Elements</h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Hide Elements"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search Custom Fields"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Elements list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredElements.map((element) => (
            <div
              key={element.id}
              draggable
              onDragStart={(e) => handleDragStart(e, element.id)}
              onDragEnd={onDragEnd}
              className="p-3 rounded-lg cursor-move hover:bg-gray-50 transition-colors border border-gray-200 bg-white flex items-center gap-3 text-sm text-gray-700 select-none shadow-sm"
            >
              <element.icon className={`w-5 h-5 ${element.color}`} />
              <span className="font-medium">{element.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
