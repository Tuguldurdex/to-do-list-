import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import {
  Button, Card, CardAction, CardContent,
  CardDescription, CardFooter, CardHeader,
  CardTitle, Input, Label
} from 'uilab-core'
import { BackApi } from '@/data'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRegister = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      await BackApi.post('/auth/register', { username, email, password })
      navigate({ to: '/login' })
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError('Энэ email эсвэл хэрэглэгчийн нэр аль хэдийн бүртгэлтэй байна')
      } else if (isAxiosError(err) && err.response?.status === 400) {
        setError('Талбаруудаа шалгана уу (нууц үг 6-с дээш тэмдэгттэй байх ёстой)')
      } else {
        setError('Бүртгэл үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Бүртгүүлэх</CardTitle>
          <CardDescription>
            Шинэ бүртгэл үүсгэнэ үү
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate({ to: '/login' })}>
              Нэвтрэх
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="grid gap-2">
              <Label htmlFor="username">Хэрэглэгчийн нэр</Label>
              <Input
                id="username"
                type="text"
                placeholder="tuguldur"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
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
          <Button className="w-full" onClick={handleRegister} disabled={isSubmitting}>
            {isSubmitting ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}