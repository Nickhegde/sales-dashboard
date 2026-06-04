'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { ProductData } from '@/lib/api'

const fmt = (v: number) => `$${(v / 1_000_000).toFixed(1)}M`

export default function TopProductsChart({ data }: { data: ProductData[] }) {
  return (
    <div className="card">
      <span className="label" style={{ display: 'block', marginBottom: '1.25rem' }}>Top Products by Revenue</span>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis type="number" tickFormatter={fmt} tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="product" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
          <Tooltip
            contentStyle={{ background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            formatter={(v: number) => [fmt(v), 'Revenue']}
          />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#e31937' : `rgba(227,25,55,${0.6 - i * 0.1})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
