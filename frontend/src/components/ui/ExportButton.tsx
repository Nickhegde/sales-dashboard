'use client'

interface ExportButtonProps {
  exportUrl: string
  days: number
}

export default function ExportButton({ exportUrl, days }: ExportButtonProps) {
  const handleExport = () => {
    const link = document.createElement('a')
    link.href = exportUrl
    link.download = `transactions_${days}d.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleExport}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 7, cursor: 'pointer',
        background: 'var(--accent)', border: 'none', color: '#fff',
        fontSize: 12, fontWeight: 500, letterSpacing: '0.02em',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      ↓ Export CSV
    </button>
  )
}