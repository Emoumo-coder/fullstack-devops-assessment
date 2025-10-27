import React from 'react'
import { Layout, Space, Typography, Avatar, Dropdown } from 'antd'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import './Header.scss';

const { Header: AntHeader } = Layout
const { Text } = Typography

const Header = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const items = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        <Text strong style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
          Form Builder
        </Text>
      </div>
      
      <div className="header-right">
        <Space size="middle">
          <Text className="user-name" style={{ 
            fontFamily: 'var(--font-public-sans)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            lineHeight: 'var(--line-height-tight)',
            color: 'var(--text-primary)'
          }}>
            {user?.name || 'User'}
          </Text>
          <Dropdown menu={{ items }} placement="bottomRight">
            <Avatar 
              size="default" 
              icon={<UserOutlined />}
              style={{ backgroundColor: 'var(--primary-green)', cursor: 'pointer' }}
            />
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  )
}

export default Header