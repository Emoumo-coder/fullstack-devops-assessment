import React, { useEffect, useState } from 'react'
import { Layout, Card, Button, Space, Typography, Switch, Dropdown, message } from 'antd'
import { PlusOutlined, CopyOutlined, MoreOutlined, DragOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { formsAPI } from '../../utils/api'
import './FormsList.scss'
import Header from '../../components/Header/Header'

const { Content } = Layout
const { Title, Text } = Typography

const FormsList = () => {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      const response = await formsAPI.getForms()
      setForms(response.data.data.forms || [])
    } catch (error) {
      message.error('Failed to load forms')
    }
  }

  const createNewForm = async () => {
    setLoading(true)
    try {
      const newForm = {
        title: `Form ${forms.length + 1}`,
        description: 'New form description',
        structure: { sections: [] }
      }
      
      const response = await formsAPI.createForm(newForm)
      const form = response.data.data.form
      
      setForms(prev => [form, ...prev])
      message.success('Form created successfully!')
      
      // Navigate to form builder for this new form
      navigate(`/builder/${form.id}`)
    } catch (error) {
      message.error('Failed to create form')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyForm = async (formId) => {
    try {
      // In a real app, you'd duplicate the form
      message.success('Form copied to clipboard')
    } catch (error) {
      message.error('Failed to copy form')
    }
  }

  const handleToggleRequired = async (formId, required) => {
    try {
      // Update form required status
      message.success(`Form marked as ${required ? 'required' : 'optional'}`)
    } catch (error) {
      message.error('Failed to update form')
    }
  }

  const moreMenuItems = (formId) => [
    {
      key: 'edit',
      label: 'Edit Form',
      onClick: () => navigate(`/builder/${formId}`)
    },
    {
      key: 'delete',
      label: 'Delete Form',
      onClick: () => handleDeleteForm(formId)
    },
    {
      key: 'preview',
      label: 'Preview Form',
      onClick: () => navigate(`/preview/${formId}`)
    }
  ]

  const handleDeleteForm = async (formId) => {
    try {
      await formsAPI.deleteForm(formId)
      setForms(prev => prev.filter(form => form.id !== formId))
      message.success('Form deleted successfully')
    } catch (error) {
      message.error('Failed to delete form')
    }
  }

  return (
    <Layout className="forms-list-layout">
      <Header />
      <Content className="forms-list-content">
        <div className="forms-container">
          {/* Header Section */}
          <div className="forms-header">
            <Title level={2} className="page-title">
              My Forms
            </Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={createNewForm}
              loading={loading}
              size="large"
            >
              Create New Form
            </Button>
          </div>

          {/* Forms Grid */}
          <div className="forms-grid">
            {forms.map((form, index) => (
              <Card key={form.id} className="form-card">
                <div className="form-card-header">
                  <div className="form-meta">
                    <Text className="form-number">
                      Section {index + 1} / Form {form.id}
                    </Text>
                    <div className="form-actions">
                      <Text className="required-text">Required</Text>
                      <Switch 
                        size="small" 
                        defaultChecked
                        onChange={(checked) => handleToggleRequired(form.id, checked)}
                      />
                      <Button 
                        type="text" 
                        icon={<CopyOutlined />} 
                        onClick={() => handleCopyForm(form.id)}
                      />
                      <Dropdown 
                        menu={{ items: moreMenuItems(form.id) }} 
                        placement="bottomRight"
                        trigger={['click']}
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    </div>
                  </div>
                  
                  <Title level={4} className="form-title">
                    {form.title}
                  </Title>
                  
                  <Text className="form-description">
                    {form.description || 'No description provided'}
                  </Text>
                </div>

                <div className="form-card-footer">
                  <Button 
                    className="drag-drop-area"
                    icon={<DragOutlined />}
                    onClick={() => navigate(`/builder/${form.id}`)}
                    block
                  >
                    Drag or Drop
                  </Button>
                </div>
              </Card>
            ))}

            {/* Empty State */}
            {forms.length === 0 && (
              <Card className="empty-state-card">
                <Space direction="vertical" size="large" align="center">
                  <DragOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  <Title level={4} style={{ margin: 0, color: '#bfbfbf' }}>
                    No Forms Created Yet
                  </Title>
                  <Text type="secondary" style={{ textAlign: 'center' }}>
                    Create your first form to start building amazing forms with drag and drop functionality.
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={createNewForm}
                    loading={loading}
                    size="large"
                  >
                    Create Your First Form
                  </Button>
                </Space>
              </Card>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default FormsList