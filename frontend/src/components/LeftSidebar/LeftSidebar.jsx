import React from 'react'
import { Layout, Space, Button, Typography } from 'antd'
import { 
  HomeOutlined, 
  UndoOutlined, 
  RedoOutlined, 
  UpOutlined, 
  DownOutlined,
  PlusOutlined,
  MinusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import './LeftSidebar.scss'

const { Sider } = Layout
const { Text } = Typography

const LeftSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const currentPage = 1
  const totalPages = 5
  const zoomLevel = 100

  const handleHome = () => {
    navigate('/')
  }

  const handleUndo = () => {
    console.log('Undo')
  }

  const handleRedo = () => {
    console.log('Redo')
  }

  const handlePageUp = () => {
    console.log('Page up')
  }

  const handlePageDown = () => {
    console.log('Page down')
  }

  const handleZoomIn = () => {
    console.log('Zoom in')
  }

  const handleZoomOut = () => {
    console.log('Zoom out')
  }

  return (
    <Sider width={80} className="left-sidebar">
      <div className="sidebar-content">
        <Space direction="vertical" size="large" className="sidebar-actions">
          <div className="angle-controls">
            <Button 
              type="text" 
              icon={<UpOutlined className="slanted-icon" />}
              className="angle-btn"
            />
            <Button 
              type="text" 
              icon={<DownOutlined className="slanted-icon" />}
              className="angle-btn"
            />
          </div>

          {/* Undo/Redo */}
          <Button 
            type="text" 
            icon={<UndoOutlined />}
            className="sidebar-btn"
            onClick={handleUndo}
          />
          <Button 
            type="text" 
            icon={<RedoOutlined />}
            className="sidebar-btn"
            onClick={handleRedo}
          />

          {/* Home */}
          <Button 
            type="text" 
            icon={<HomeOutlined />}
            className="sidebar-btn"
            onClick={handleHome}
          />

          {/* Page Navigation */}
          <div className="page-navigation">
            <Button 
              type="text" 
              icon={<ArrowUpOutlined />}
              className="nav-btn"
              onClick={handlePageUp}
            />
            <div className="page-numbers">
              <Text className="page-current">{currentPage.toString().padStart(2, '0')}</Text>
              <Text className="page-separator">-</Text>
              <Text className="page-total">{totalPages.toString().padStart(2, '0')}</Text>
            </div>
            <Button 
              type="text" 
              icon={<ArrowDownOutlined />}
              className="nav-btn"
              onClick={handlePageDown}
            />
          </div>

          {/* Zoom Controls */}
          <div className="zoom-controls">
            <Button 
              type="text" 
              icon={<PlusOutlined />}
              className="zoom-btn"
              onClick={handleZoomIn}
            />
            <Text className="zoom-level">{zoomLevel}%</Text>
            <Button 
              type="text" 
              icon={<MinusOutlined />}
              className="zoom-btn"
              onClick={handleZoomOut}
            />
          </div>
        </Space>
      </div>
    </Sider>
  )
}

export default LeftSidebar