import React from 'react'
import { Layout, Typography, Card, Space } from 'antd'
import { 
  // InputOutlined, 
  MailOutlined, 
  // RadioButtonCheckedOutlined, 
  CheckSquareOutlined, 
  SelectOutlined, 
  UploadOutlined, 
  RadiusBottomrightOutlined,
  PercentageOutlined
} from '@ant-design/icons'

const { Sider } = Layout
const { Title, Text } = Typography

const fieldTypes = [
  {
    type: 'text',
    label: 'Text Input',
    icon: <PercentageOutlined />,
    description: 'Single line text input'
  },
  {
    type: 'email',
    label: 'Email Address',
    icon: <MailOutlined />,
    description: 'Email input with validation'
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: <RadiusBottomrightOutlined />,
    description: 'Single selection from options'
  },
  {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: <CheckSquareOutlined />,
    description: 'Multiple selection options'
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: <SelectOutlined />,
    description: 'Select from dropdown options'
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: <UploadOutlined />,
    description: 'Upload files with drag & drop'
  }
]

const RightSidebar = () => {
  return (
    <Sider width={320} className="right-sidebar">
      <div className="sidebar-content">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="sidebar-header">
            <Title level={4} style={{ 
              margin: 0,
              fontFamily: 'var(--font-roboto)',
              fontWeight: 500,
              color: 'var(--text-primary)'
            }}>
              Form Elements
            </Title>
            <Text style={{
              fontFamily: 'var(--font-public-sans)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)'
            }}>
              Drag and drop to add fields
            </Text>
          </div>

          <div className="elements-list">
            {fieldTypes.map((field) => (
              <Card 
                key={field.type}
                className="element-card"
                size="small"
                hoverable
              >
                <Space>
                  <div className="element-icon">
                    {field.icon}
                  </div>
                  <div className="element-info">
                    <Text strong style={{
                      fontFamily: 'var(--font-public-sans)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      lineHeight: 'var(--line-height-tight)'
                    }}>
                      {field.label}
                    </Text>
                    <Text type="secondary" style={{
                      fontFamily: 'var(--font-public-sans)',
                      fontSize: '12px',
                      display: 'block'
                    }}>
                      {field.description}
                    </Text>
                  </div>
                </Space>
              </Card>
            ))}
          </div>
        </Space>
      </div>
    </Sider>
  )
}

export default RightSidebar