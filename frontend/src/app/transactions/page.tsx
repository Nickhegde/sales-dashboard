import { api } from '@/lib/api'
import Sidebar from '@/components/layout/Sidebar'
import DateRangeFilter from '@/components/ui/DateRangeFilter'
import ExportButton from '@/components/ui/ExportButton'

const STATUS_COLORS: Record<string, string> = {
  'Closed Won': '#22c55e',
  'Closed Lost': '#e31937',
  'In Progress': '#f59e0b',
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; days?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const days = parseInt(params.days || '365')
  const data = await api.getTransactions(page, days)
  const exportUrl = api.getExportUrl(days)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '2rem', maxWidth: 1200 }}>

        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Transactions</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {data.total.toLocaleString()} total · page {data.page}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <DateRangeFilter current={days} basePath="/transactions" />
            <ExportButton exportUrl={exportUrl} days={days} />
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ID','Date','Customer','Product','Region','Rep','Amount','Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Amount' ? 'right' : 'left',
                    fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.results.map((tx, i) => (
                <tr key={tx.id} style={{ borderBottom: i < data.results.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{tx.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{tx.date}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{tx.customer}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{tx.product}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{tx.region}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{tx.rep}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, textAlign: 'right' }}>${tx.amount.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 20,
                      color: STATUS_COLORS[tx.status] || 'var(--text-secondary)',
                      background: `${STATUS_COLORS[tx.status] || '#888'}1a` }}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          {page > 1 && <a href={`/transactions?page=${page - 1}&days=${days}`} style={{ padding: '6px 14px', borderRadius: 6,
            border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}>← Prev</a>}
          <a href={`/transactions?page=${page + 1}&days=${days}`} style={{ padding: '6px 14px', borderRadius: 6,
            border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}>Next →</a>
        </div>

      </main>
    </div>
  )
}