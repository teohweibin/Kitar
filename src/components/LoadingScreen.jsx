import TopBar from './TopBar.jsx'

export default function LoadingScreen() {
  return (
    <div className="app-shell">
      <TopBar title="" />
      <main className="screen" aria-busy="true">
        <span className="visually-hidden">Loading…</span>
        <div className="skeleton" style={{ height: 140 }} />
        <div className="skeleton" style={{ height: 88 }} />
        <div className="skeleton" style={{ height: 88 }} />
      </main>
    </div>
  )
}
