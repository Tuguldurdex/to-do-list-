import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import axios from 'axios'
import {
  Button, Card, CardAction, CardContent,
  CardDescription, CardFooter, CardHeader,
  CardTitle, Input, Label
} from 'uilab-core'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/auth/register', {
        email,
        password,
      })
      navigate({ to: '/login' })
    } catch {
      setError('Бүртгэл үүсгэхэд алдаа гарлаа')
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
          <Button className="w-full" onClick={handleRegister}>
            Бүртгүүлэх
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}