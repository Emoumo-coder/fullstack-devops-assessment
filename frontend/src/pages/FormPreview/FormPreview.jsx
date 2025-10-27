import React, { useEffect, useState } from 'react'
import { Layout, Card, Typography, Form, Input, Button, Radio, Checkbox, DatePicker, Upload, Space, Divider, message } from 'antd'
import { UploadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import { formsAPI } from '../../utils/api'
import './FormPreview.scss'

const { Content } = Layout
const { Title, Text } = Typography
const { TextArea } = Input

const FormPreview = () => {
  const { formId } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadFormData()
  }, [formId])

  const loadFormData = async () => {
    try {
      const response = await formsAPI.getForm(formId)
      setFormData(response.data.data.form)
    } catch (error) {
      message.error('Failed to load form data')
      navigate('/')
    }
  }

  const onFinish = async (values) => {
    setSubmitting(true)
    try {
      console.log('Form submitted:', values)
      message.success('Form submitted successfully!')
      form.resetFields()
    } catch (error) {
      message.error('Failed to submit form')
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormField = (field) => {
    const rules = []
    if (field.required) {
      rules.push({ required: true, message: `${field.label} is required` })
    }

    switch (field.type) {
      case 'text':
        return (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={rules}
          >
            <Input 
              size="large" 
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </Form.Item>
        )

      case 'email':
        return (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={[
              ...rules,
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              size="large" 
              type="email"
              placeholder="Enter email address"
            />
          </Form.Item>
        )

      case 'tel':
        return (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={rules}
          >
            <Input 
              size="large" 
              type="tel"
              placeholder="Enter phone number"
            />
          </Form.Item>
        )

      case 'date':
        return (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={rules}
          >
            <DatePicker 
              size="large" 
              style={{ width: '100%' }}
              placeholder="Select date"
            />
          </Form.Item>
        )

      case 'radio':
        return (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={rules}
          >
            <Radio.Group>
              <Space direction="vertical">
                {field.config?.options?.map(option => (
                  <Radio key={option} value={option.toLowerCase()}>
                    {option}
                  </Radio>
                )) || (
                  <>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </>
                )}
              </Space>
            </Radio.Group>
          </Form.Item>
        )

      case 'checkbox':
        return (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={rules}
          >
            <Checkbox.Group>
              <Space direction="vertical">
                {field.config?.options?.map(option => (
                  <Checkbox key={option} value={option.toLowerCase()}>
                    {option}
                  </Checkbox>
                )) || (
                  <>
                    <Checkbox value="mr">Mr.</Checkbox>
                    <Checkbox value="mrs">Mrs.</Checkbox>
                    <Checkbox value="ms">Ms.</Checkbox>
                    <Checkbox value="dr">Dr.</Checkbox>
                  </>
                )}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        )

      case 'select':
        return (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={rules}
          >
            <Input 
              size="large" 
              placeholder={`Select ${field.label.toLowerCase()}`}
            />
          </Form.Item>
        )

      case 'file':
        return (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={rules}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e
              }
              return e?.fileList
            }}
          >
            <Upload.Dragger 
              name="file"
              multiple={false}
              beforeUpload={() => false}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single file upload
              </p>
            </Upload.Dragger>
          </Form.Item>
        )

      default:
        return (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={rules}
          >
            <Input 
              size="large" 
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </Form.Item>
        )
    }
  }

  const renderSection = (section) => (
    <Card key={section.id} className="preview-section" title={section.title}>
      {section.description && (
        <Text type="secondary" className="section-description">
          {section.description}
        </Text>
      )}
      
      {section.groups?.map(group => (
        <div key={group.id} className="preview-group">
          {section.groups.length > 1 && (
            <Divider orientation="left" className="group-divider">
              <Text strong>{group.title}</Text>
            </Divider>
          )}
          
          <div className="group-fields">
            {group.fields?.map(field => renderFormField(field))}
          </div>
        </div>
      ))}
    </Card>
  )

  if (!formData) {
    return (
      <Layout className="form-preview-layout">
        <Header />
        <Layout>
          <LeftSidebar />
          <Content className="main-content-with-sidebar form-preview-content">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <Text>Loading form preview...</Text>
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }

  return (
    <Layout className="form-preview-layout">
      <Header />
      <Layout>
        <LeftSidebar />
        <Content className="main-content-with-sidebar form-preview-content">
          <div className="preview-container">
            {/* Preview Header */}
            <div className="preview-header">
              <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                <div className="header-actions">
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/builder/${formId}`)}
                  >
                    Edit Form
                  </Button>
                  <Button 
                    icon={<EyeOutlined />}
                    onClick={() => window.print()}
                  >
                    Print Preview
                  </Button>
                </div>
                
                <Title level={1} className="form-title">
                  {formData.title}
                </Title>
                
                {formData.description && (
                  <Text className="form-description">
                    {formData.description}
                  </Text>
                )}
                
                <Divider />
              </Space>
            </div>

            {/* Form Preview */}
            <div className="form-preview">
              <Card className="preview-card">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                  className="preview-form"
                >
                  {formData.structure?.sections?.map(section => renderSection(section))}

                  {/* Submit Section */}
                  <Card className="submit-section">
                    <div className="submit-actions">
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large"
                        loading={submitting}
                        className="submit-button"
                      >
                        Submit Form
                      </Button>
                      <Button 
                        htmlType="button" 
                        size="large"
                        onClick={() => form.resetFields()}
                        className="reset-button"
                      >
                        Clear Form
                      </Button>
                    </div>
                    
                    <Text type="secondary" className="form-footer">
                      * Required fields are marked with an asterisk
                    </Text>
                  </Card>
                </Form>
              </Card>
            </div>

            {/* Preview Info */}
            <div className="preview-info">
              <Card size="small" title="Form Information">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div className="info-item">
                    <Text strong>Form ID:</Text>
                    <Text code>{formData.id}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Total Sections:</Text>
                    <Text>{formData.structure?.sections?.length || 0}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Total Groups:</Text>
                    <Text>
                      {formData.structure?.sections?.reduce((total, section) => 
                        total + (section.groups?.length || 0), 0
                      )}
                    </Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Total Fields:</Text>
                    <Text>
                      {formData.structure?.sections?.reduce((total, section) => 
                        total + (section.groups?.reduce((groupTotal, group) => 
                          groupTotal + (group.fields?.length || 0), 0
                        ) || 0), 0
                      )}
                    </Text>
                  </div>
                </Space>
              </Card>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default FormPreview