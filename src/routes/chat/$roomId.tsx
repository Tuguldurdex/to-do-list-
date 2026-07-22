import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'uilab-core'
import { ArrowLeft, Check, Copy, LogOut, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useChatRoom } from '@/socket/hooks'
import { getCurrentUserEmail } from '@/socket/auth'

export const Route = createFileRoute('/chat/$roomId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { roomId } = Route.useParams()
  const navigate = useNavigate()
  const { room, messages, isJoining, presenceNote, sendMessage, leaveRoom } = useChatRoom(roomId)
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const currentUserEmail = getCurrentUserEmail()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage(text.trim())
    setText('')
  }

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
      toast.success('Room ID хуулагдлаа')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Room ID-г хуулахад алдаа гарлаа')
    }
  }

  const handleLeave = () => {
    leaveRoom()
    navigate({ to: '/chat' })
  }

  if (isJoining) {
    return <p className="text-center mt-10">Room-д нэгдэж байна...</p>
  }

  return (
    <div className="max-w-lg mx-auto my-6 px-4 flex flex-col h-[85vh]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1 border-b border-border pb-3">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/chat' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold truncate flex-1">{room?.name ?? 'Chat'}</h1>
        <Button variant="ghost" size="icon" onClick={handleLeave} aria-label="Room-оос гарах">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <button
        onClick={handleCopyRoomId}
        className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 hover:text-foreground transition-colors self-start"
      >
        <span className="font-mono">{roomId}</span>
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>

      {presenceNote && (
        <p className="text-xs text-muted-foreground text-center mb-2">{presenceNote}</p>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-10">
            Мессеж алга. Эхлээд бичээрэй!
          </p>
        )}
        {messages.map(m => {
          const isOwn = currentUserEmail !== null && m.senderEmail === currentUserEmail
          return (
            <div key={m.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
              {!isOwn && (
                <div className="flex items-baseline gap-1.5 mb-0.5 px-1">
                  <span className="text-sm font-semibold text-foreground">
                    {m.senderUsername}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {m.senderEmail}
                  </span>
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                  isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-card'
                }`}
              >
                <p className="text-sm wrap-break-word">{m.text}</p>
                <span
                  className={`text-xs block mt-0.5 ${
                    isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {new Date(m.createdAt).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
        <Input
          placeholder="Мессеж бичих..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <Button size="icon" onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}