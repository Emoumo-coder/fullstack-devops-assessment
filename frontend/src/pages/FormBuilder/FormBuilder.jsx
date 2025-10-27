import React, { useEffect, useState } from 'react'
import { Layout, Space, Typography, Button, Card, Switch, Dropdown, message } from 'antd'
import { PlusOutlined, CopyOutlined, MoreOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import { formsAPI } from '../../utils/api'
import './FormBuilder.scss'

const { Content } = Layout
const { Title, Text } = Typography

const FormBuilder = () => {
  const { formId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState([])

  useEffect(() => {
    if (formId) {
      loadForm()
    } else {
      // Create new form if no ID provided
      createNewForm()
    }
  }, [formId])

  const loadForm = async () => {
    try {
      const response = await formsAPI.getForm(formId)
      const formData = response.data.data.form
      setForm(formData)
      setSections(formData.structure?.sections || [])
    } catch (error) {
      message.error('Failed to load form')
      navigate('/')
    }
  }

  const createNewForm = async () => {
    setLoading(true)
    try {
      const newForm = {
        title: 'Untitled Form',
        description: '',
        structure: { sections: [] }
      }
      const response = await formsAPI.createForm(newForm)
      const createdForm = response.data.data.form
      setForm(createdForm)
      navigate(`/builder/${createdForm.id}`, { replace: true })
    } catch (error) {
      message.error('Failed to create form')
    } finally {
      setLoading(false)
    }
  }

  const saveForm = async (updates) => {
    try {
      const formToUpdate = { ...form, ...updates }
      const response = await formsAPI.updateForm(formId, formToUpdate)
      setForm(response.data.data.form)
    } catch (error) {
      message.error('Failed to save form')
    }
  }

  const addSection = async () => {
    const newSection = {
      id: `section_${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      description: '',
      groups: [],
      required: false
    }
    
    const updatedSections = [...sections, newSection]
    setSections(updatedSections)
    await saveForm({ structure: { sections: updatedSections } })
    message.success('Section added successfully')
  }

  const addGroup = async (sectionId) => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId)
    if (sectionIndex === -1) return

    const section = sections[sectionIndex]
    const newGroup = {
      id: `group_${Date.now()}`,
      title: `Group ${section.groups.length + 1}`,
      description: '',
      fields: [],
      required: false
    }

    const updatedSections = [...sections]
    updatedSections[sectionIndex].groups.push(newGroup)
    setSections(updatedSections)
    await saveForm({ structure: { sections: updatedSections } })
    message.success('Group added successfully')
  }

  const handleSectionClick = (sectionId) => {
    navigate(`/builder/${formId}/section/${sectionId}`)
  }

  const moreMenuItems = (sectionId) => [
    {
      key: 'edit',
      label: 'Edit Section',
      onClick: () => console.log('Edit section', sectionId)
    },
    {
      key: 'duplicate',
      label: 'Duplicate Section',
      onClick: () => console.log('Duplicate section', sectionId)
    },
    {
      key: 'delete',
      label: 'Delete Section',
      onClick: () => console.log('Delete section', sectionId)
    }
  ]

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <Layout className="form-builder-layout">
      <Header />
      <Layout>
        <LeftSidebar />
        <Content className="main-content-with-sidebar form-builder-content">
          <div className="form-builder-container">
            {/* Header */}
            <div className="builder-header">
              <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
                <Title level={2} className="section-title" editable={{
                  onChange: (value) => saveForm({ title: value }),
                  text: form.title
                }}>
                  {form.title}
                </Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  className="add-elements-btn"
                >
                  Add Elements
                </Button>
                <Button 
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/preview/${formId}`)}
                >
                  Preview Form
                </Button>
              </Space>
            </div>

            {/* Sections List */}
            <div className="sections-container">
              {sections.map((section, index) => (
                <Card key={section.id} className="section-card">
                  <div className="section-header">
                    <div className="section-meta">
                      <Text className="section-number">
                        Section {index + 1} / Form {formId}
                      </Text>
                      <div className="section-actions">
                        <Text className="required-text">Required</Text>
                        <Switch 
                          size="small" 
                          checked={section.required}
                          onChange={(checked) => {
                            const updatedSections = sections.map(s => 
                              s.id === section.id ? { ...s, required: checked } : s
                            )
                            setSections(updatedSections)
                            saveForm({ structure: { sections: updatedSections } })
                          }}
                        />
                        <Button 
                          type="text" 
                          icon={<CopyOutlined />} 
                          onClick={() => console.log('Copy section', section.id)}
                        />
                        <Dropdown 
                          menu={{ items: moreMenuItems(section.id) }} 
                          placement="bottomRight"
                          trigger={['click']}
                        >
                          <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                      </div>
                    </div>
                    
                    <Title level={4} className="section-title" editable={{
                      onChange: (value) => {
                        const updatedSections = sections.map(s => 
                          s.id === section.id ? { ...s, title: value } : s
                        )
                        setSections(updatedSections)
                        saveForm({ structure: { sections: updatedSections } })
                      },
                      text: section.title
                    }}>
                      {section.title}
                    </Title>
                    
                    <Text className="section-description" editable={{
                      onChange: (value) => {
                        const updatedSections = sections.map(s => 
                          s.id === section.id ? { ...s, description: value } : s
                        )
                        setSections(updatedSections)
                        saveForm({ structure: { sections: updatedSections } })
                      },
                      text: section.description
                    }}>
                      {section.description || 'Add section description...'}
                    </Text>
                  </div>

                  {/* Groups in this section */}
                  <div className="groups-container">
                    {section.groups.map((group, groupIndex) => (
                      <Card key={group.id} className="group-card" onClick={() => handleSectionClick(section.id)}>
                        <div className="group-header">
                          <div className="group-meta">
                            <Text className="group-number">
                              Group {groupIndex + 1}
                            </Text>
                            <div className="group-actions">
                              <Switch 
                                size="default"
                                checked={group.required}
                                onChange={(checked) => {
                                  const updatedSections = sections.map(s => 
                                    s.id === section.id ? {
                                      ...s,
                                      groups: s.groups.map(g => 
                                        g.id === group.id ? { ...g, required: checked } : g
                                      )
                                    } : s
                                  )
                                  setSections(updatedSections)
                                  saveForm({ structure: { sections: updatedSections } })
                                }}
                              />
                            </div>
                          </div>
                          
                          <Title level={5} className="group-title" editable={{
                            onChange: (value) => {
                              const updatedSections = sections.map(s => 
                                s.id === section.id ? {
                                  ...s,
                                  groups: s.groups.map(g => 
                                    g.id === group.id ? { ...g, title: value } : g
                                  )
                                } : s
                              )
                              setSections(updatedSections)
                              saveForm({ structure: { sections: updatedSections } })
                            },
                            text: group.title,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}>
                            {group.title}
                          </Title>
                          
                          <Text className="group-description">
                            {group.fields.length} fields - Click to add elements
                          </Text>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Add Group Button */}
                  <div className="add-group-section">
                    <Button 
                      type="dashed" 
                      icon={<PlusOutlined />}
                      onClick={() => addGroup(section.id)}
                      block
                      className="add-group-btn"
                    >
                      Add Group to Section
                    </Button>
                  </div>
                </Card>
              ))}

              {/* Add Section Button */}
              <div className="add-section-container">
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />}
                  onClick={addSection}
                  block
                  className="add-section-btn"
                  loading={loading}
                >
                  {sections.length === 0 ? 'Add First Section' : 'Add Another Section'}
                </Button>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default FormBuilder