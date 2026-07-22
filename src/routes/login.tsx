import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import {
  Button, Card, CardAction, CardContent,
  CardDescription, CardFooter, CardHeader,
  CardTitle, Input, Label
} from 'uilab-core'
import { BackApi } from '@/data'
import { connectSocket } from '@/socket'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      const res = await BackApi.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      connectSocket()
      navigate({ to: '/todolist' })
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError('Email эсвэл нууц үг буруу')
      } else {
        setError('Сервертэй холбогдоход алдаа гарлаа. Дахин оролдоно уу.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Нэвтрэх</CardTitle>
          <CardDescription>
            Email болон нууц үгээ оруулна уу
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate({ to: '/register' })}>
              Бүртгүүлэх
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" onClick={handleLogin} disabled={isSubmitting}>
            {isSubmitting ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}