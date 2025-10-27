import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import FormBuilder from './pages/FormBuilder/FormBuilder'
import { setCredentials, logout } from './store/slices/authSlice'
import { authAPI } from './utils/api'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import FormsList from './pages/FormsList/FormsList'
import SectionDetail from './pages/SectionDetail/SectionDetail'
import FormPreview from './pages/FormPreview/FormPreview'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  return !isAuthenticated ? children : <Navigate to="/builder" />
}

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.auth)
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user data
      authAPI.getUser()
        .then(response => {
          dispatch(setCredentials({
            user: response.data.data.user,
            token: token
          }))
        })
        .catch(() => {
          localStorage.removeItem('token')
          dispatch(logout())
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [dispatch])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#035F5B',
          borderRadius: 6,
          fontFamily: 'Roboto, Public Sans, sans-serif',
        },
      }}
    >
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/builder/:formId?" 
            element={
              <ProtectedRoute>
                <FormBuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/builder/:formId/section/:sectionId" 
            element={
              <ProtectedRoute>
                <SectionDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/preview/:formId" 
            element={
              <ProtectedRoute>
                <FormPreview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <FormsList />
              </ProtectedRoute>
            } 
          />
          {/* <Route path="/" element={<Navigate to={isAuthenticated ? "/builder" : "/login"} />} /> */}
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App