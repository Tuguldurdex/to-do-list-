
export function getCurrentUserEmail(): string | null {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payloadBase64 = token.split(".")[1]
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    )
    const payload = JSON.parse(json) as { email?: string }
    return payload.email ?? null
  } catch {
    return null
  }
}