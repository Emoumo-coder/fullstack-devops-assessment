import { useSelector, useDispatch } from 'react-redux'
import { setCredentials, logout } from '../store/slices/authSlice'
import { authAPI } from '../utils/api'

export const useAuth = () => {
  const { user, token, isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  return {
    user,
    token,
    isAuthenticated,
    login: (credentials) => dispatch(setCredentials(credentials)),
    logout: () => {
        dispatch(logout()),
        authAPI.logout().catch(console.error)
    },
  }
}