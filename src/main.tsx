import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import ProvidersWrapper from "@/providers/index.tsx"
import "./styles.css"

const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <ProvidersWrapper />
    </StrictMode>,
  )
}
