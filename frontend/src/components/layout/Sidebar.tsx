'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const nav = [
  { href: '/', label: 'Overview', icon: '▦' },
  { href: '/revenue', label: 'Revenue', icon: '◈' },
  { href: '/transactions', label: 'Transactions', icon: '≡' },
  { href: '/regions', label: 'Regions', icon: '◉' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      padding: '1.5rem 0', position: 'fixed', top: 0, left: 0
    }}>
      <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>SalesIQ</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ANALYTICS</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '1.5rem 0.75rem', flex: 1 }}>
        {nav.map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.75rem',
            borderRadius: 8, marginBottom: 2, textDecoration: 'none',
            color: pathname === item.href ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: pathname === item.href ? 'var(--bg-subtle)' : 'transparent',
            fontSize: 13, fontWeight: pathname === item.href ? 500 : 400,
          }}>
            <span style={{ fontSize: 16, opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>FY 2024 · Live Data</div>
      </div>
    </aside>
  )
}
