'use client'

import { AutoForm } from '@/components/form/auto-form'
import useNotify from '@/hooks/use-notify'
import { api } from '@/models/axios'
import Cookies from 'js-cookie'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const Login = () => {
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm()
  const { toastError, toastSuccess } = useNotify()

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      const res = await api.post(`/auth/login`, values)
      Cookies.set('saminvest-token', res.data.token)
      Cookies.set(
        'saminvest-log-data',
        JSON.stringify({
          username: res.data.user.username,
          role: res.data.user.role,
          token: res.data.token,
        })
      )
      toastSuccess(t('loginSuccess'))
      router.push(res.data.user.role.replace('_', '-').toLowerCase())
    } catch (error: any) {
      switch (error?.response?.data?.message) {
        case 'User already exists':
          toastError(t('User already exists'))
          break
        case 'User not found':
          toastError(t('User not found'))
          break
        default:
          toastError(t('loginError'))
          break
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="max-w-[450px] w-full bg-background z-50 p-5 rounded-lg">
      <div className="text-center text-2xl font-bold my-5">{t('login')}</div>

      <AutoForm
        className={'border-none px-1 py-0 bg-transparent'}
        form={form}
        submitText={t('login')}
        onSubmit={onSubmit}
        loading={loading}
        fields={[
          {
            name: 'username',
            type: 'text',
            label: t('username'),
            placeholder: t('username'),
          },
          {
            name: 'password',
            type: 'password',
            label: t('password'),
            placeholder: t('password'),
          },
        ]}
      />
    </div>
  )
}

export default Login
