"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, Home, FileText, Copy, Minus, Plus } from "lucide-react"
import { useState } from "react"

interface LeftSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function LeftSidebar({ activeTab, onTabChange }: LeftSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["01"])

  const sections = [
    { id: "01", label: "01" },
    { id: "02", label: "02" },
    { id: "03", label: "03" },
    { id: "04", label: "04" },
    { id: "05", label: "05" },
    { id: "06", label: "06" },
    { id: "07", label: "07" },
  ]

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4">
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg bg-teal-600 text-white hover:bg-teal-700">
        <LayoutGrid className="w-5 h-5" />
      </Button>

      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100">
        <Copy className="w-5 h-5" />
      </Button>

      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100">
        <FileText className="w-5 h-5" />
      </Button>

      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100">
        <Home className="w-5 h-5" />
      </Button>

      <div className="flex-1 flex flex-col items-center gap-2 mt-4">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            {section.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100">
          <Minus className="w-5 h-5" />
        </Button>
        <div className="text-xs font-medium text-gray-600 text-center">100</div>
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
