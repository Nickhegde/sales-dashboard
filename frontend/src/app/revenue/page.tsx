import { api } from '@/lib/api'
import Sidebar from '@/components/layout/Sidebar'
import RevenueTrendChart from '@/components/charts/RevenueTrendChart'

const fmt = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`

export default async function RevenuePage({
  searchParams,
}: {
  searchParams: { period?: string }
}) {
  const period = searchParams.period || 'monthly'
  const [trend, products] = await Promise.all([
    api.getRevenueTrend(period),
    api.getTopProducts(7),
  ])

  const totalCurrent = trend.current_year.reduce((a, b) => a + b, 0)
  const totalPrevious = trend.previous_year.reduce((a, b) => a + b, 0)
  const growthPct = (((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(1)
  const bestMonth = trend.labels[trend.current_year.indexOf(Math.max(...trend.current_year))]
  const avgMonthly = totalCurrent / trend.current_year.length

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '2rem', maxWidth: 1200 }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Revenue</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>FY 2024 · detailed breakdown</p>
          </div>
          {/* Period toggle */}
          <div style={{ display: 'flex', gap: 6, background: 'var(--bg-subtle)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
            {['monthly', 'quarterly'].map(p => (
              <a key={p} href={`/revenue?period=${p}`} style={{
                padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                textDecoration: 'none',
                background: period === p ? 'var(--bg-card)' : 'transparent',
                color: period === p ? 'var(--text-primary)' : 'var(--text-muted)',
                border: period === p ? '1px solid var(--border-strong)' : '1px solid transparent',
              }}>{p.charAt(0).toUpperCase() + p.slice(1)}</a>
            ))}
          </div>
        </div>

        {/* Summary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Revenue (YTD)', value: fmt(totalCurrent) },
            { label: 'YoY Growth', value: `+${growthPct}%` },
            { label: `Best ${period === 'monthly' ? 'Month' : 'Quarter'}`, value: bestMonth },
            { label: 'Avg per Period', value: fmt(avgMonthly) },
            { label: 'Prior Year Total', value: fmt(totalPrevious) },
            { label: 'Revenue Gap', value: fmt(totalCurrent - totalPrevious) },
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

        {/* Trend Chart */}
        <div style={{ marginBottom: '1.5rem' }}>
          <RevenueTrendChart data={trend} />
        </div>

        {/* Product breakdown table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Revenue by Product</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Product', 'Revenue', 'Units Sold', 'Avg Price', 'Share'].map(h => (
                  <th key={h} style={{
                    padding: '10px 20px', textAlign: h === 'Product' ? 'left' : 'right',
                    fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em'
                  }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const totalRev = products.reduce((a, b) => a + b.revenue, 0)
                const share = ((p.revenue / totalRev) * 100).toFixed(1)
                return (
                  <tr key={p.product} style={{ borderBottom: i < products.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '12px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: i === 0 ? '#e31937' : `rgba(227,25,55,${0.7 - i * 0.08})`
                      }} />
                      {p.product}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 500, fontSize: 13 }}>{fmt(p.revenue)}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{p.units.toLocaleString()}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{fmt(p.avg_price)}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                        <div style={{ width: 60, height: 4, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${share}%`, background: i === 0 ? '#e31937' : `rgba(227,25,55,${0.7 - i * 0.08})`, borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 36, textAlign: 'right' }}>{share}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}