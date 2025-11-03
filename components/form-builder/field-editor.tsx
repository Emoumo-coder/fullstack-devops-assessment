"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, X } from "lucide-react"
import type { FormField } from "./types"

interface FieldEditorProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
  onDelete: () => void
}

export function FieldEditor({ field, onUpdate, onDelete }: FieldEditorProps) {
  const [newOption, setNewOption] = useState("")

  const handleAddOption = () => {
    if (newOption.trim()) {
      const currentOptions = field.options || []
      onUpdate({ options: [...currentOptions, newOption.trim()] })
      setNewOption("")
    }
  }

  const handleRemoveOption = (index: number) => {
    const currentOptions = field.options || []
    onUpdate({ options: currentOptions.filter((_, i) => i !== index) })
  }

  const needsOptions = ["radio", "checkbox", "select"].includes(field.type)

  return (
    <div className="p-4 bg-white border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Field Properties</h3>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <Input
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Field label"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
          <Input
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={field.required}
            onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
          />
          <label className="text-sm text-gray-700">Required field</label>
        </div>

        {needsOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="space-y-2">
              {(field.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])]
                      newOptions[index] = e.target.value
                      onUpdate({ options: newOptions })
                    }}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveOption(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option"
                  onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleAddOption}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
