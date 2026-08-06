import { useEffect, useState } from 'react'
import {
  FiArrowRight,
  FiBell,
  FiCheckCircle,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSun,
} from 'react-icons/fi'

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () =>
      (typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'),
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}

const buttons: Array<{
  label: string
  variant: string
  icon?: React.ReactNode
}> = [
  { label: 'Primary', variant: 'bg-primary text-primary-foreground' },
  { label: 'Secondary', variant: 'bg-secondary text-secondary-foreground' },
  { label: 'Ghost', variant: 'text-foreground hover:bg-accent' },
  { label: 'Destructive', variant: 'bg-destructive text-destructive-foreground' },
]

const badges = [
  { label: 'In Progress', className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { label: 'Done', className: 'bg-green-500/15 text-green-600 dark:text-green-400' },
  { label: 'Blocked', className: 'bg-red-500/15 text-red-600 dark:text-red-400' },
  { label: 'High', className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
]

const tasks = [
  { title: 'Design system foundations', meta: 'PROJ-112', done: true },
  { title: 'Setup authentication flow', meta: 'PROJ-118', done: false },
  { title: 'Kanban board interactions', meta: 'PROJ-124', done: false },
  { title: 'Reports dashboard', meta: 'PROJ-130', done: false },
]

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              T
            </span>
            <span className="text-sm font-semibold tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground sm:flex">
              <FiSearch className="size-4" />
              <span>Search…</span>
              <kbd className="ml-6 rounded border border-border bg-background px-1.5 text-[10px] font-medium">
                Ctrl K
              </kbd>
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <FiBell className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {theme === 'dark' ? <FiSun className="size-5" /> : <FiMoon className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="flex flex-col gap-4 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Good morning, Amr
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Your day at a glance
            </h1>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-card hover:bg-primary/90"
          >
            <FiPlus className="size-4" />
            New Task
          </button>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Tasks due today', value: '12' },
            { label: 'In progress', value: '8' },
            { label: 'Completed', value: '34' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-5 shadow-card"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-lg border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">My tasks</h2>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <FiArrowRight className="size-4" />
            </button>
          </div>
          <ul className="divide-y divide-border">
            {tasks.map((task) => (
              <li
                key={task.title}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FiCheckCircle
                    className={`size-5 shrink-0 ${
                      task.done ? 'text-success' : 'text-border'
                    }`}
                  />
                  <span
                    className={`truncate text-sm ${
                      task.done
                        ? 'text-muted-foreground line-through'
                        : 'font-medium'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {task.meta}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h2 className="mb-4 text-sm font-semibold">Buttons</h2>
            <div className="flex flex-wrap items-center gap-3">
              {buttons.map((button) => (
                <button
                  key={button.label}
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium shadow-card ${button.variant}`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h2 className="mb-4 text-sm font-semibold">Badges</h2>
            <div className="flex flex-wrap items-center gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
