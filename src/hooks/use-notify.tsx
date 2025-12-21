import { toast } from 'react-toastify'

const useNotify = () => {
  const toastSuccess = (title: string, options?: any) =>
    toast.success(title, { ...options })

  const toastError = (title: string, options?: any) =>
    toast.error(title, { ...options })

  const toastWarning = (title: string, options?: any) =>
    toast.warning(title, { ...options })

  return { toastSuccess, toastError, toastWarning }
}

export default useNotify
