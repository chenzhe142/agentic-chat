export const Sidebar = () => {
  return (
    <aside className="flex flex-col h-full">
      <header className="flex justify-between">
        <span>Logo</span>
        <button>New Chat</button>
      </header>

      <nav className="h-full flex justify-center items-center">
        <p>No conversations yet</p>
      </nav>
    </aside>
  )
}
