interface DateRangeFilterProps {
  current: number
  basePath: string
  extraParams?: string
}

const RANGES = [
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'Last 365 days', days: 365 },
]

export default function DateRangeFilter({ current, basePath, extraParams = '' }: DateRangeFilterProps) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      background: 'var(--bg-subtle)', padding: 4,
      borderRadius: 8, border: '1px solid var(--border)'
    }}>
      {RANGES.map(r => (
        <a
          key={r.days}
          href={`${basePath}?days=${r.days}${extraParams}`}
          style={{
            padding: '5px 12px', borderRadius: 6, fontSize: 12,
            fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap',
            background: current === r.days ? 'var(--bg-card)' : 'transparent',
            color: current === r.days ? 'var(--text-primary)' : 'var(--text-muted)',
            border: current === r.days ? '1px solid var(--border-strong)' : '1px solid transparent',
          }}
        >
          {r.label}
        </a>
      ))}
    </div>
  )
}