export interface FormField {
  id: string
  type: "text" | "email" | "phone" | "radio" | "checkbox" | "select" | "date" | "file" | "textarea" | "number" | "url" | "password"
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For radio, checkbox, select
  fullWidth?: boolean // When true, field takes full width; when false, allows 2 fields per row
}

export interface FormGroup {
  id: string
  title: string
  required?: boolean
  fields: FormField[]
}

export interface FormSection {
  id: string
  title: string
  required?: boolean
  groups: FormGroup[]
}

export interface Form {
  id: string
  title: string
  description: string
  sections: FormSection[]
  createdAt: string
  updatedAt: string
}
