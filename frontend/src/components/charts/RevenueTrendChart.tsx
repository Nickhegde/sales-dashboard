'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { RevenueTrend } from '@/lib/api'

const fmt = (v: number) => `$${(v / 1_000_000).toFixed(1)}M`

export default function RevenueTrendChart({ data }: { data: RevenueTrend }) {
  const chartData = data.labels.map((label, i) => ({
    label,
    current: data.current_year[i],
    previous: data.previous_year[i],
  }))

  return (
    <div className="card">
      <div style={{ marginBottom: '1.25rem' }}>
        <span className="label">Revenue Trend</span>
        <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
          <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
            <span style={{ width: 20, height: 2, background: '#e31937', display: 'inline-block', borderRadius: 2 }} />
            2024
          </span>
          <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
            <span style={{ width: 20, height: 2, background: '#444', display: 'inline-block', borderRadius: 2, borderTop: '2px dashed #555' }} />
            2023
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
          <Tooltip
            contentStyle={{ background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            labelStyle={{ color: '#888', fontSize: 12 }}
            formatter={(v: number) => [fmt(v), '']}
          />
          <Line type="monotone" dataKey="current" stroke="#e31937" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="previous" stroke="#333" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
