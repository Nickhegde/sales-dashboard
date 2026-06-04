import type { FunnelStage } from '@/lib/api'

export default function SalesFunnel({ data }: { data: FunnelStage[] }) {
  const max = data[0]?.count || 1
  return (
    <div className="card">
      <span className="label" style={{ display: 'block', marginBottom: '1.25rem' }}>Sales Funnel</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((stage, i) => (
          <div key={stage.stage}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{stage.stage}</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{stage.count.toLocaleString()}</span>
                {stage.conversion_pct && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>→ {stage.conversion_pct}%</span>
                )}
              </div>
            </div>
            <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${(stage.count / max) * 100}%`,
                background: i === data.length - 1 ? 'var(--accent)' : `rgba(227,25,55,${0.3 + (i * 0.15)})`,
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
