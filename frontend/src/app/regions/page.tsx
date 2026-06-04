import { api } from '@/lib/api'
import Sidebar from '@/components/layout/Sidebar'

const fmt = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`

const REPS: Record<string, string> = {
  'North America': 'Alex Chen',
  'Europe': 'Maria Santos',
  'Asia Pacific': 'Priya Patel',
  'Latin America': 'James Okafor',
  'Middle East': 'Tom Wheeler',
}

const REGION_COLORS = ['#e31937', 'rgba(227,25,55,0.7)', 'rgba(227,25,55,0.5)', 'rgba(227,25,55,0.35)', 'rgba(227,25,55,0.22)']

export default async function RegionsPage() {
  const regions = await api.getRevenueByRegion()
  const total = regions.reduce((a, b) => a + b.revenue, 0)
  const topRegion = regions[0]
  const fastestGrowing = [...regions].sort((a, b) => b.change_pct - a.change_pct)[0]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '2rem', maxWidth: 1200 }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Regions</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>FY 2024 · global revenue breakdown</p>
        </div>

        {/* Summary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Global Revenue', value: fmt(total) },
            { label: 'Top Region', value: topRegion.region },
            { label: 'Fastest Growing', value: `${fastestGrowing.region} (+${fastestGrowing.change_pct}%)` },
          ].map(m => (
            <div key={m.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

          {/* Bar chart — visual */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Revenue by Region</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {regions.map((r, i) => (
                <div key={r.region}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.region}</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{fmt(r.revenue)}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      width: `${(r.revenue / regions[0].revenue) * 100}%`,
                      background: REGION_COLORS[i],
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut-style share breakdown */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Revenue Share</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {regions.map((r, i) => (
                <div key={r.region} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: REGION_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{r.region}</span>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, minWidth: 40, textAlign: 'right' }}>{r.share_pct}%</span>
                    <span className={r.change_pct >= 0 ? 'badge-up' : 'badge-dn'} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20,
                      color: r.change_pct >= 0 ? '#22c55e' : '#e31937',
                      background: r.change_pct >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(227,25,55,0.12)',
                      minWidth: 56, textAlign: 'center', display: 'inline-block' }}>
                      {r.change_pct >= 0 ? '↑' : '↓'} {Math.abs(r.change_pct)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Region detail cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {regions.map((r, i) => (
            <div key={r.region} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '1rem',
              borderTop: `2px solid ${REGION_COLORS[i]}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10, color: 'var(--text-primary)' }}>{r.region}</div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>{fmt(r.revenue)}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>{r.share_pct}% of global</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>REGIONAL REP</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{REPS[r.region]}</div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}