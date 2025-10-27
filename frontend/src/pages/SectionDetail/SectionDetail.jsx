import React, { useEffect, useState } from 'react'
import { Layout, Card, Typography, Space, Input, Tabs, Collapse, Button, message, Switch, Dropdown, Form, Radio, Checkbox, DatePicker, Upload } from 'antd'
import { SearchOutlined, PlusOutlined, CopyOutlined, MoreOutlined, UploadOutlined } from '@ant-design/icons'
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import { formsAPI } from '../../utils/api'
import './SectionDetail.scss'
import ArrowSquareDown from '../../components/Icons/ArrowSquareDown'

const { Content } = Layout
const { Title, Text } = Typography
const { TextArea } = Input

const FormFieldRenderer = ({ field, onUpdate }) => {
  const [required, setRequired] = useState(field.required || false)

  const handleRequiredChange = (checked) => {
    setRequired(checked)
    onUpdate({ ...field, required: checked })
  }

  const moreMenuItems = [
    {
      key: 'duplicate',
      label: 'Duplicate Field',
      onClick: () => console.log('Duplicate field', field.id)
    },
    {
      key: 'delete',
      label: 'Delete Field',
      onClick: () => console.log('Delete field', field.id)
    }
  ]

  const renderFieldByType = () => {
    const commonProps = {
      placeholder: `Enter ${field.label.toLowerCase()}`,
      size: 'large',
      style: { width: '100%' }
    }

    switch (field.type) {
      case 'text':
        return <Input {...commonProps} />

      case 'email':
        return <Input {...commonProps} type="email" />

      case 'tel':
        return <Input {...commonProps} type="tel" />

      case 'date':
        return <DatePicker {...commonProps} style={{ width: '100%' }} />

      case 'radio':
        return (
          <Radio.Group {...commonProps}>
            <Space direction="vertical">
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Space>
          </Radio.Group>
        )

      case 'checkbox':
        return (
          <Checkbox.Group {...commonProps}>
            <Space direction="vertical">
              <Checkbox value="mr">Mr.</Checkbox>
              <Checkbox value="mrs">Mrs.</Checkbox>
              <Checkbox value="ms">Ms.</Checkbox>
              <Checkbox value="dr">Dr.</Checkbox>
            </Space>
          </Checkbox.Group>
        )

      case 'select':
        return (
          <Input {...commonProps} placeholder={`Select ${field.label.toLowerCase()}`} />
        )

      case 'file':
        return (
          <Upload.Dragger 
            {...commonProps}
            multiple={false}
            beforeUpload={() => false}
            style={{ padding: '20px' }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to upload photo</p>
          </Upload.Dragger>
        )

      default:
        return <Input {...commonProps} />
    }
  }

  return (
    <Card className="form-field-card">
      <div className="field-header">
        <div className="field-meta">
          <Text className="field-label-text">{field.label}</Text>
          <div className="field-actions">
            <Text className="required-text">Required</Text>
            <Switch 
              size="small" 
              checked={required}
              onChange={handleRequiredChange}
            />
            <Button 
              type="text" 
              icon={<CopyOutlined />} 
              onClick={() => console.log('Copy field', field.id)}
            />
            <Dropdown 
              menu={{ items: moreMenuItems }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="field-content">
        {renderFieldByType()}
      </div>
    </Card>
  )
}

// Draggable Field Component
const DraggableField = ({ field }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `draggable-${field.id}`,
    data: { field }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-field"
    >
      <Card size="small" className="field-card">
        <Space>
          <div className="field-icon">{field.icon}</div>
          <div className="field-info">
            <Text strong className="field-label">{field.label}</Text>
            <Text type="secondary" className="field-code">{field.code}</Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}

// Droppable Group Area
const DroppableGroup = ({ group, fields, onFieldUpdate }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${group.id}`,
    data: { group }
  })

  const style = {
    backgroundColor: isOver ? 'rgba(3, 95, 91, 0.1)' : 'transparent',
    border: isOver ? '2px dashed #035F5B' : '2px dashed #d9d9d9',
  }

  const handleFieldUpdate = (fieldId, updates) => {
    onFieldUpdate(group.id, fieldId, updates)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="droppable-group"
    >
      <div className="group-header">
        <Title level={5} className="group-title">{group.title}</Title>
        <Text className="group-description">
          {fields.length} fields • Drag and drop elements here
        </Text>
      </div>
      
      <div className="group-fields">
        {fields.map(field => (
          <FormFieldRenderer 
            key={field.id} 
            field={field}
            onUpdate={(updates) => handleFieldUpdate(field.id, updates)}
          />
        ))}
        
        {fields.length === 0 && (
          <div className="empty-drop-zone">
            <Text type="secondary">Drop fields here to add form elements</Text>
          </div>
        )}
      </div>
    </div>
  )
}

// Elements Sidebar Component
const ElementsSidebar = ({ activeTab, setActiveTab, searchTerm, setSearchTerm }) => {
  const standardFieldItems = [
    {
      key: 'PRF - Account Profile',
      label: 'PRF - Account Profile',
      children: (
        <div className="fields-list">
          {[
            { 
              id: 'photo', 
              label: 'Photo', 
              code: 'PRF-PHOTO', 
              icon: <ArrowSquareDown />, 
              type: 'file',
              config: { multiple: false, accept: 'image/*' }
            },
            { 
              id: 'dob', 
              label: 'Date of Birth', 
              code: 'PRF-DOB', 
              icon: <ArrowSquareDown />, 
              type: 'date',
              config: { format: 'YYYY-MM-DD' }
            },
            { 
              id: 'state', 
              label: 'State', 
              code: 'PRF-STATE', 
              icon: <ArrowSquareDown />, 
              type: 'select',
              config: { options: ['State 1', 'State 2', 'State 3'] }
            },
            { 
              id: 'gender', 
              label: 'Gender', 
              code: 'PRF-GENDER', 
              icon: <ArrowSquareDown />, 
              type: 'radio',
              config: { options: ['Male', 'Female', 'Other'] }
            },
            { 
              id: 'email', 
              label: 'Email Address', 
              code: 'PRF-EMAIL', 
              icon: <ArrowSquareDown />, 
              type: 'email',
              config: { placeholder: 'Enter email address' }
            },
            { 
              id: 'lastname', 
              label: 'Last Name', 
              code: 'PRF-LNAME', 
              icon: <ArrowSquareDown />, 
              type: 'text',
              config: { placeholder: 'Enter last name' }
            },
            { 
              id: 'residency', 
              label: 'Do you have residency?', 
              code: 'PRF-RES', 
              icon: <ArrowSquareDown />, 
              type: 'radio',
              config: { options: ['Yes', 'No'] }
            },
            { 
              id: 'salutation', 
              label: 'Salutation', 
              code: 'PRF-SAL', 
              icon: <ArrowSquareDown />, 
              type: 'checkbox',
              config: { options: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'] }
            },
            { 
              id: 'mobile', 
              label: 'Mobile Number', 
              code: 'PRF-MOBILE', 
              icon: <ArrowSquareDown />, 
              type: 'tel',
              config: { placeholder: 'Enter mobile number' }
            },
            { 
              id: 'firstname', 
              label: 'First Name', 
              code: 'PRF-FNAME', 
              icon: <ArrowSquareDown />, 
              type: 'text',
              config: { placeholder: 'Enter first name' }
            }
          ].filter(field => 
            field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            field.code.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(field => (
            <DraggableField key={field.id} field={field} />
          ))}
        </div>
      )
    },
    {
      key: 'BIO - Biodata',
      label: 'BIO - Biodata',
      children: (
        <div className="fields-list">
          {[
            { 
              id: 'bio-fullname', 
              label: 'Full Name', 
              code: 'BIO-NAME', 
              icon: <ArrowSquareDown />, 
              type: 'text',
              config: { placeholder: 'Enter full name' }
            },
            { 
              id: 'bio-nationality', 
              label: 'Nationality', 
              code: 'BIO-NAT', 
              icon: <ArrowSquareDown />, 
              type: 'select',
              config: { options: ['Nationality 1', 'Nationality 2'] }
            }
          ].filter(field => 
            field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            field.code.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(field => (
            <DraggableField key={field.id} field={field} />
          ))}
        </div>
      )
    },
    {
        key: 'CON - Contact Info',
        label: 'CON - Contact Info',
        children: (
          <div className="fields-list">
            {[
              { 
                id: 'con-address', 
                label: 'Address', 
                code: 'CON-ADDR', 
                icon: <ArrowSquareDown />, 
                type: 'text',
                config: { placeholder: 'Enter address' }
              },
              { 
                id: 'con-phone', 
                label: 'Phone', 
                code: 'CON-PHONE', 
                icon: <ArrowSquareDown />, 
                type: 'tel',
                config: { placeholder: 'Enter phone number' }
              }
            ].filter(field => 
              field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              field.code.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(field => (
              <DraggableField key={field.id} field={field} />
            ))}
          </div>
        )
      },
      {
        key: 'PAS - Passport',
        label: 'PAS - Passport',
        children: (
          <div className="fields-list">
            {[
              { 
                id: 'pass-number', 
                label: 'Passport Number', 
                code: 'PAS-NUM', 
                icon: <ArrowSquareDown />, 
                type: 'text',
                config: { placeholder: 'Enter passport number' }
              },
              { 
                id: 'pass-expiry', 
                label: 'Expiry Date', 
                code: 'PAS-EXP', 
                icon: <ArrowSquareDown />, 
                type: 'date',
                config: { format: 'YYYY-MM-DD' }
              }
            ].filter(field => 
              field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              field.code.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(field => (
              <DraggableField key={field.id} field={field} />
            ))}
          </div>
        )
      },
      {
        key: 'IDC - ID Cards',
        label: 'IDC - ID Cards',
        children: (
          <div className="fields-list">
            {[
              { 
                id: 'id-type', 
                label: 'ID Type', 
                code: 'IDC-TYPE', 
                icon: <ArrowSquareDown />, 
                type: 'select',
                config: { options: ['Driver License', 'National ID', 'Passport'] }
              },
              { 
                id: 'id-number', 
                label: 'ID Number', 
                code: 'IDC-NUM', 
                icon: <ArrowSquareDown />, 
                type: 'text',
                config: { placeholder: 'Enter ID number' }
              }
            ].filter(field => 
              field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              field.code.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(field => (
              <DraggableField key={field.id} field={field} />
            ))}
          </div>
        )
      }
  ]

  const tabItems = [
    {
      key: 'standard',
      label: 'Standard Fields',
      children: (
        <>
          <div className="search-container">
            <Input
              placeholder="Search elements..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="fields-categories">
            <Collapse 
              items={standardFieldItems}
              defaultActiveKey={['PRF - Account Profile']}
              ghost
              className="fields-collapse"
            />
          </div>
        </>
      )
    },
    {
      key: 'custom',
      label: 'Custom Fields',
      children: (
        <div className="custom-fields-empty">
          <Text type="secondary">No custom fields created yet</Text>
          <Button type="primary" icon={<PlusOutlined />} className="create-custom-btn">
            Create Custom Field
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="elements-sidebar">
      <div className="sidebar-header">
        <Title level={4} className="sidebar-title">Elements</Title>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
          className="elements-tabs"
        />
      </div>
    </div>
  )
}

const SectionDetail = () => {
  const { formId, sectionId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('standard')
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState(null)
  const [section, setSection] = useState(null)
  const [activeDrag, setActiveDrag] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSectionData()
  }, [formId, sectionId])

  const loadSectionData = async () => {
    try {
      const response = await formsAPI.getForm(formId)
      const formData = response.data.data.form
      setForm(formData)
      
      const sectionData = formData.structure?.sections?.find(s => s.id === sectionId)
      if (!sectionData) {
        message.error('Section not found')
        navigate(`/builder/${formId}`)
        return
      }
      setSection(sectionData)
    } catch (error) {
      message.error('Failed to load section data')
      navigate(`/builder/${formId}`)
    }
  }

  const handleDragStart = (event) => {
    setActiveDrag(event.active.data.current.field)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    
    if (over && active) {
      const draggedField = active.data.current.field
      const targetGroup = over.data.current.group
      
      // Create proper form field configuration
      const newField = {
        ...draggedField,
        id: `${draggedField.id}-${Date.now()}`,
        groupId: targetGroup.id,
        required: false,
        config: draggedField.config || {}
      }
      
      const updatedSections = form.structure.sections.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            groups: s.groups.map(g => {
              if (g.id === targetGroup.id) {
                return {
                  ...g,
                  fields: [...(g.fields || []), newField]
                }
              }
              return g
            })
          }
        }
        return s
      })
      
      try {
        await formsAPI.updateForm(formId, {
          ...form,
          structure: { sections: updatedSections }
        })
        message.success(`"${draggedField.label}" added to "${targetGroup.title}"`)
        setForm(prev => ({ ...prev, structure: { sections: updatedSections } }))
        const updatedSection = updatedSections.find(s => s.id === sectionId)
        setSection(updatedSection)
      } catch (error) {
        console.error('Failed to add field:', error)
        message.error('Failed to add field')
      }
    }
    
    setActiveDrag(null)
  }

  const handleFieldUpdate = async (groupId, fieldId, updates) => {
    const updatedSections = form.structure.sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          groups: s.groups.map(g => {
            if (g.id === groupId) {
              return {
                ...g,
                fields: g.fields.map(f => 
                  f.id === fieldId ? { ...f, ...updates } : f
                )
              }
            }
            return g
          })
        }
      }
      return s
    })
    
    try {
      await formsAPI.updateForm(formId, {
        ...form,
        structure: { sections: updatedSections }
      })
      setForm(prev => ({ ...prev, structure: { sections: updatedSections } }))
    } catch (error) {
      message.error('Failed to update field')
    }
  }

  const addNewGroup = async () => {
    const newGroup = {
      id: `group_${Date.now()}`,
      title: `Group ${section.groups.length + 1}`,
      fields: []
    }
    
    const updatedSections = form.structure.sections.map(s => 
      s.id === sectionId ? { ...s, groups: [...s.groups, newGroup] } : s
    )
    
    try {
      await formsAPI.updateForm(formId, {
        ...form,
        structure: { sections: updatedSections }
      })
      setForm(prev => ({ ...prev, structure: { sections: updatedSections } }))
      const updatedSection = updatedSections.find(s => s.id === sectionId)
      setSection(updatedSection)
      message.success('Group added successfully')
    } catch (error) {
      message.error('Failed to add group')
    }
  }

  if (!form || !section) {
    return (
      <Layout className="section-detail-layout">
        <Header />
        <Layout>
          <LeftSidebar />
          <Content className="main-content-with-sidebar section-detail-content">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <Text>Loading form data...</Text>
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }

  return (
    <Layout className="section-detail-layout">
      <Header />
      <Layout>
        <LeftSidebar />
        <Content className="main-content-with-sidebar section-detail-content">
          <DndContext 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="section-detail-container">
              <div className="groups-area">
                <div className="section-header">
                  <Title level={2} className="section-title">
                    {section.title}
                  </Title>
                  <Text className="section-description">
                    {section.description || 'Add elements to your groups by dragging from the right panel'}
                  </Text>
                </div>

                <div className="groups-list">
                  {section.groups.map(group => (
                    <DroppableGroup
                      key={group.id}
                      group={group}
                      fields={group.fields || []}
                      onFieldUpdate={handleFieldUpdate}
                    />
                  ))}
                  
                  <div className="add-group-container">
                    <Button 
                      type="dashed" 
                      icon={<PlusOutlined />}
                      onClick={addNewGroup}
                      block
                      className="add-group-btn"
                    >
                      Add New Group
                    </Button>
                  </div>
                </div>
              </div>

              <ElementsSidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>

            <DragOverlay>
              {activeDrag ? (
                <Card size="small" className="field-card dragging">
                  <Space>
                    <div className="field-icon">{activeDrag.icon}</div>
                    <div className="field-info">
                      <Text strong className="field-label">{activeDrag.label}</Text>
                      <Text type="secondary" className="field-code">{activeDrag.code}</Text>
                    </div>
                  </Space>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Content>
      </Layout>
    </Layout>
  )
}

export default SectionDetail