import React from 'react'
import { Typography, Card, Space, Button } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const { Title, Text } = Typography

const MainContent = () => {
  const { currentForm } = useSelector(state => state.formBuilder)

  return (
    <div className="main-content-area">
      <div className="form-preview">
        <Card className="form-preview-card">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="form-header">
              <Title 
                level={2} 
                editable={{ 
                  onChange: (value) => console.log('Title changed:', value),
                  triggerType: ['text', 'icon'],
                  icon: <EditOutlined />
                }}
                style={{ 
                  margin: 0,
                  fontFamily: 'var(--font-roboto)',
                  fontWeight: 400,
                  color: 'var(--text-primary)'
                }}
              >
                {currentForm.title}
              </Title>
              <Text 
                type="secondary"
                editable={{ 
                  onChange: (value) => console.log('Description changed:', value),
                  triggerType: ['text', 'icon'],
                  icon: <EditOutlined />
                }}
                style={{
                  fontFamily: 'var(--font-roboto)',
                  fontSize: 'var(--text-base)',
                  lineHeight: 'var(--line-height-normal)'
                }}
              >
                {currentForm.description || 'Add a description for your form...'}
              </Text>
            </div>

            <div className="empty-state">
              <Space direction="vertical" size="middle" align="center" style={{ width: '100%', padding: '60px 0' }}>
                <div className="empty-icon">
                  <PlusOutlined style={{ fontSize: '48px', color: 'var(--border-color)' }} />
                </div>
                <Title level={4} style={{ 
                  margin: 0,
                  fontFamily: 'var(--font-roboto)',
                  fontWeight: 400,
                  color: 'var(--text-secondary)'
                }}>
                  No form elements added yet
                </Title>
                <Text style={{
                  fontFamily: 'var(--font-public-sans)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  textAlign: 'center'
                }}>
                  Drag and drop form elements from the right panel to start building your form.
                </Text>
              </Space>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  )
}

export default MainContent