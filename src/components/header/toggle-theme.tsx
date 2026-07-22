import { LaptopMinimalIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipTrigger } from "uilab-core"

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme()

  const renderIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon />
      case "light":
        return <Sun />
      default:
        return <LaptopMinimalIcon />
    }
  }

  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={handleClick}
        className="focus-visible:border-ring focus-visible:ring-ring/30 inline-flex size-9 items-center justify-center rounded-md hover:bg-accent"
      >
        {renderIcon()}
      </TooltipTrigger>
      <TooltipContent>{"Theme"}</TooltipContent>
    </Tooltip>
  )
}
