import { LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "uilab-core"

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme()

  const renderIcon = () => {
    switch (theme) {
      case "dark":
        return <MoonIcon />
      case "light":
        return <SunIcon />
      default:
        return <LaptopMinimalIcon />
    }
  }

  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={handleClick} variant="ghost" size="icon">
          {renderIcon()}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{"Theme"}</TooltipContent>
    </Tooltip>
  )
}
