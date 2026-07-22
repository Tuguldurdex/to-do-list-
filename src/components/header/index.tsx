import { Link } from "@tanstack/react-router"
import ToggleTheme from "./toggle-theme"

export default function Header() {
  return (
    <header className="p-4 flex justify-between items-center border-b border-border">
      <p className="text-lg font-semibold">
        {"Todolist"}
      </p>
      <nav className="flex items-center gap-4">
        <Link to="/todolist" className="text-sm hover:underline">
          Todolist
        </Link>
        <Link to="/chat" className="text-sm hover:underline">
          Chat
        </Link>
        <ToggleTheme />
      </nav>
    </header>
  )
}
