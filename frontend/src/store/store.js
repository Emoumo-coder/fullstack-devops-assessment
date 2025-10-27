import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import formBuilderSlice from './slices/formBuilderSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    formBuilder: formBuilderSlice,
  },
})