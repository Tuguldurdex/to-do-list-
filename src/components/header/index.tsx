import ToggleTheme from "./toggle-theme"

export default function Header() {
  return (
    <header className="p-4 flex justify-between border-b border-border">
      <p className="text-lg">
        {"UILab Template"}
      </p>
      <ToggleTheme />
    </header>
  )
}
