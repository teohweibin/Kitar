import TopBar from './TopBar.jsx'
import GlassCard from './GlassCard.jsx'

// Temporary screen body until the page's work card builds it.
export default function PlaceholderScreen({ title, backTo, right, note }) {
  return (
    <>
      <TopBar title={title} backTo={backTo} right={right} />
      <main className="screen">
        <GlassCard>
          <p className="muted">{note}</p>
        </GlassCard>
      </main>
    </>
  )
}
