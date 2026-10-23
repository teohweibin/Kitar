import './GlassCard.css'

// Card surface from design.md. `hero` adds the blur and the orange top rim.
export default function GlassCard({ hero = false, className = '', children, ...rest }) {
  const classes = ['glass-card', hero && 'glass-card--hero', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
