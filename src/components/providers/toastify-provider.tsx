'use client'

import { useTheme } from 'next-themes'
import { ToastContainer } from 'react-toastify'

const ToastifyProvider = () => {
  const { theme } = useTheme()

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme || 'colored'}
    />
  )
}

export default ToastifyProvider
