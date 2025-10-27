import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentForm: {
    title: 'Untitled Form',
    description: '',
    structure: {
      sections: [],
    },
  },
  isSaving: false,
  error: null,
}

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormTitle: (state, action) => {
      state.currentForm.title = action.payload
    },
    setFormDescription: (state, action) => {
      state.currentForm.description = action.payload
    },
    addSection: (state, action) => {
      const newSection = {
        id: `section_${Date.now()}`,
        title: action.payload.title || 'New Section',
        groups: [],
      }
      state.currentForm.structure.sections.push(newSection)
    },
    addGroup: (state, action) => {
      const { sectionId, title } = action.payload
      const section = state.currentForm.structure.sections.find(s => s.id === sectionId)
      if (section) {
        const newGroup = {
          id: `group_${Date.now()}`,
          title: title || 'New Group',
          fields: [],
        }
        section.groups.push(newGroup)
      }
    },
    addField: (state, action) => {
      const { sectionId, groupId, fieldType } = action.payload
      const section = state.currentForm.structure.sections.find(s => s.id === sectionId)
      if (section) {
        const group = section.groups.find(g => g.id === groupId)
        if (group) {
          const newField = {
            id: `field_${Date.now()}`,
            type: fieldType,
            label: getDefaultLabel(fieldType),
            required: false,
            options: fieldType === 'radio' || fieldType === 'select' || fieldType === 'checkbox' 
              ? ['Option 1', 'Option 2'] 
              : [],
          }
          group.fields.push(newField)
        }
      }
    },
    setSaving: (state, action) => {
      state.isSaving = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    updateFormStructure: (state, action) => {
      state.currentForm.structure = action.payload
    },
  },
})

const getDefaultLabel = (fieldType) => {
  const labels = {
    text: 'Text Input',
    email: 'Email Address',
    radio: 'Radio Group',
    checkbox: 'Checkbox Group',
    select: 'Dropdown',
    file: 'File Upload',
  }
  return labels[fieldType] || 'Field'
}

export const {
  setFormTitle,
  setFormDescription,
  addSection,
  addGroup,
  addField,
  setSaving,
  setError,
  updateFormStructure,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer