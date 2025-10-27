import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { authAPI } from '../../utils/api'
import './Login.scss'

const { Title, Text } = Typography

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    
    try {
      const response = await authAPI.login(values)
      const { data } = response.data
      
      login({
        user: data.user,
        token: data.token,
      })
      
      navigate('/builder')
    } catch (error) {
      const errorData = error.response?.data
      
      if (errorData?.errors) {
        // const firstError = Object.values(errorData.errors)[0]?.[0]
        // setError(firstError || 'Login failed')
        const errors = errorData.errors;

        Object.keys(errors).forEach(key => {
          message.error(errors[key][0])
        })
      } else {
        message.error(errorData?.message || 'Login failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <Title level={2} className="login-title">
              Welcome Back
            </Title>
            <Text className="login-subtitle">
              Sign in to your Form Builder account
            </Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            className="login-form"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email!',
                },
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email Address" 
                className="form-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  min: 6,
                  message: 'Password must be at least 6 characters!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                className="form-input"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="login-button"
                loading={loading}
                block
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Text className="footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="register-link">
                Create one here
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login