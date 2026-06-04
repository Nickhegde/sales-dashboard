interface MetricCardProps {
  label: string
  value: string
  change: number
  subtitle?: string
}

export default function MetricCard({ label, value, change, subtitle }: MetricCardProps) {
  const isUp = change >= 0
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span className="label">{label}</span>
      <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className={isUp ? 'badge-up' : 'badge-down'}>
          {isUp ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        {subtitle && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
    </div>
  )
}
