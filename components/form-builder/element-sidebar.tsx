"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Type, Radio, CheckSquare, FileUp, List, Calendar, Mail, Phone } from "lucide-react"

const FIELD_TYPES = [
  { id: "text", label: "Text Input", icon: Type },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "radio", label: "Radio Button", icon: Radio },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "select", label: "Dropdown", icon: List },
  { id: "date", label: "Date", icon: Calendar },
  { id: "file", label: "File Upload", icon: FileUp },
]

interface ElementSidebarProps {
  selectedGroupId: string | null
  onSelectFieldType: (type: string) => void
}

export function ElementSidebar({ selectedGroupId, onSelectFieldType }: ElementSidebarProps) {
  return (
    <div className="w-64 border-l bg-card overflow-auto">
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-2">Form Elements</h3>
          <p className="text-xs text-muted-foreground">Click to add elements to selected group</p>
        </div>

        <div className="space-y-2">
          {FIELD_TYPES.map((fieldType) => {
            const Icon = fieldType.icon
            return (
              <Button
                key={fieldType.id}
                variant="outline"
                className="w-full justify-start gap-2 h-auto py-2 bg-transparent"
                onClick={() => onSelectFieldType(fieldType.id)}
                disabled={!selectedGroupId}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{fieldType.label}</span>
              </Button>
            )
          })}
        </div>

        {!selectedGroupId && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3 text-xs text-amber-800">Select a group to add elements</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
