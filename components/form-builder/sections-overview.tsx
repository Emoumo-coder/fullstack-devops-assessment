"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, MoreVertical, Trash2 } from "lucide-react"
import type { FormSection } from "./types"

interface SectionsOverviewProps {
  sections: FormSection[]
  onAddSection: () => void
  onSelectSection: (id: string) => void
  onCopySection: (section: FormSection) => void
  onDeleteSection?: (id: string) => void
}

export function SectionsOverview({
  sections,
  onAddSection,
  onSelectSection,
  onCopySection,
  onDeleteSection
}: SectionsOverviewProps) {
  return (
    <div className="flex gap-6">
      {/* Left: sections list as small cards */}
      <div className="flex flex-col gap-4 w-[360px]">
        {sections.map((s, idx) => (
          <div
            key={s.id}
            className="rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-t-lg">
              <span className="text-xs font-medium text-slate-700">Section {idx + 1}</span>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopySection(s);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700"
                  title="Copy section"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {onDeleteSection && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection(s.id);
                    }}
                    className="p-1 text-red-400 hover:text-red-700"
                    title="Delete section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <span>Required</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600 relative" />
                </label>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center">
                <input
                  className="flex-1 text-sm text-slate-800 bg-transparent outline-none border-b border-transparent focus:border-teal-500"
                  placeholder="Title Here"
                  defaultValue={s.title}
                  onBlur={() => onSelectSection(s.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection(s.id);
                  }}
                  className="ml-2 p-1 text-slate-400 hover:text-slate-700"
                  title="Open section"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {/* <div className="mt-3 h-4 w-10 mx-auto rounded bg-gray-200" /> */}
            </div>
          </div>
        ))}
        <Button onClick={onAddSection} variant="outline" className="justify-center">
          + Add Section
        </Button>
      </div>

      {/* Right: drag or drop placeholder */}
      <div className="flex-1 min-h-[200px] rounded-lg border-2 border-dashed border-gray-300 bg-white/60">
        <div className="h-full w-full flex items-center justify-center text-slate-500">
          Drag or Drop
        </div>
      </div>
    </div>
  )
}
