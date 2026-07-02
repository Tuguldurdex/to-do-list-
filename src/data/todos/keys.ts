export default {
  getTodoByIdKey: (id: string) => ["todoById", id] as const,
}