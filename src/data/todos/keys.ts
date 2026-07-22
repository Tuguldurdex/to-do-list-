export default {
  getTodoByIdKey: (id: string) => ["todoById", id] as const,
  getTodosKey: () => ["todos"] as const,
}