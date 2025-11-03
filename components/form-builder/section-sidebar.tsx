"use client"

import { Plus, Home, ChevronUp, ChevronDown, Undo2, Redo2, Minus, Plus as PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FormGroup } from "./types"

interface SectionSidebarProps {
  groups: FormGroup[]
  selectedGroupId: string | null
  onSelectGroup: (id: string) => void
  onAddSection: () => void
  onUndo: () => void
  onRedo: () => void
  zoom: number
  onZoom: (next: number) => void
  onHome: () => void
  onNavigateUp: () => void
  onNavigateDown: () => void
}

export function SectionSidebar({ groups, selectedGroupId, onSelectGroup, onAddSection, onUndo, onRedo, zoom, onZoom, onHome, onNavigateUp, onNavigateDown }: SectionSidebarProps) {
  return (
    <div className="w-20 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 gap-6">
      {/* Undo / Redo */}
      <div className="w-12 rounded-lg overflow-hidden shadow-sm bg-white border border-gray-200">
        <button onClick={onUndo} className="w-full h-10 flex items-center justify-center hover:bg-gray-50" title="Undo">
          <Undo2 className="w-5 h-5 text-slate-700" />
        </button>
        <div className="h-px bg-gray-200" />
        <button onClick={onRedo} className="w-full h-10 flex items-center justify-center hover:bg-gray-50" title="Redo">
          <Redo2 className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {/* Group navigator */}
      <div className="w-12 rounded-lg shadow-sm bg-white border border-gray-200 flex flex-col items-center py-2 gap-2">
        <button onClick={onHome} className="w-8 h-8 rounded-md bg-teal-700 text-white flex items-center justify-center" title="Home">
          <Home className="w-4 h-4" />
        </button>
        <button onClick={onNavigateUp} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-slate-600" title="Up">
          <ChevronUp className="w-4 h-4" />
        </button>
        <div className="max-h-64 overflow-y-auto flex flex-col items-center gap-1">
          {groups.map((group, index) => (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className={`w-8 h-8 rounded-md border text-xs font-semibold flex items-center justify-center ${
                selectedGroupId === group.id
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <button onClick={onNavigateDown} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-slate-600" title="Down">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom controls */}
      <div className="w-12 rounded-lg overflow-hidden shadow-sm bg-white border border-gray-200">
        <button
          onClick={() => onZoom(Math.max(50, zoom - 10))}
          className="w-full h-10 flex items-center justify-center hover:bg-gray-50"
          title="Zoom out"
        >
          <Minus className="w-4 h-4 text-slate-700" />
        </button>
        <div className="h-10 w-full flex items-center justify-center text-xs text-slate-700 border-t border-b border-gray-200">
          {zoom}
        </div>
        <button
          onClick={() => onZoom(Math.min(200, zoom + 10))}
          className="w-full h-10 flex items-center justify-center hover:bg-gray-50"
          title="Zoom in"
        >
          <PlusIcon className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Add section */}
      <Button
        onClick={onAddSection}
        size="sm"
        className="w-12 h-12 p-0 rounded bg-teal-600 hover:bg-teal-700 text-white"
        title="Add new section"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  )
}
