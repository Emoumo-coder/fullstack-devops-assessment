import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { authAPI } from '../../utils/api'
import './Register.scss'

const { Title, Text } = Typography

const Register = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const response = await authAPI.register(values)
      const { data } = response.data
      
      login({
        user: data.user,
        token: data.token,
      })
      
      message.success('Registration successful!')
      navigate('/builder')
    } catch (error) {
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors
        Object.keys(errors).forEach(key => {
          message.error(errors[key][0])
        })
      } else {
        message.error(error.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <Card className="register-card">
          <div className="register-header">
            <Title level={2} className="register-title">
              Create Account
            </Title>
            <Text className="register-subtitle">
              Join Form Builder to create amazing forms
            </Text>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            className="register-form"
            size="large"
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your full name!',
                },
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Full Name" 
                className="form-input"
              />
            </Form.Item>

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
                  min: 8,
                  message: 'Password must be at least 8 characters!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                className="form-input"
              />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Passwords do not match!'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                className="form-input"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="register-button"
                loading={loading}
                block
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="register-footer">
            <Text className="footer-text">
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Register