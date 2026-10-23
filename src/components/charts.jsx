import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './charts.css'

// Single-series charts in Kitar's orange. Hex values mirror tokens.css (SVG attributes
// cannot read CSS variables reliably). Validated: #C8641E passes lightness, chroma and
// contrast against the dark card surface.
const SERIES = '#C8641E'
const SERIES_HOVER = '#DA7430'
const GRID = 'rgba(255, 240, 225, 0.08)'
const TICK = { fill: '#A99D92', fontSize: 12, fontFamily: 'Poppins, system-ui, sans-serif' }

function KgTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label ?? payload[0].payload.label}</p>
      <p className="chart-tooltip__value num">{payload[0].value.toLocaleString('en-MY')} kg</p>
    </div>
  )
}

export function KgByMonthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="kg-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES} stopOpacity={0.35} />
            <stop offset="100%" stopColor={SERIES} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={48} />
        <Tooltip content={<KgTooltip />} cursor={{ stroke: '#A99D92', strokeDasharray: '3 3' }} />
        <Area
          type="monotone"
          dataKey="kg"
          stroke={SERIES}
          strokeWidth={2}
          fill="url(#kg-area)"
          dot={{ r: 4, fill: SERIES, stroke: '#17120F', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: SERIES_HOVER, stroke: '#17120F', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function KgColumnChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={48} />
        <Tooltip content={<KgTooltip />} cursor={{ fill: 'rgba(255, 240, 225, 0.05)' }} />
        <Bar dataKey="kg" fill={SERIES} radius={[4, 4, 0, 0]} activeBar={{ fill: SERIES_HOVER }} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function KgBarListChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barCategoryGap="22%">
        <CartesianGrid horizontal={false} stroke={GRID} />
        <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="label" tick={TICK} axisLine={false} tickLine={false} width={116} />
        <Tooltip content={<KgTooltip />} cursor={{ fill: 'rgba(255, 240, 225, 0.05)' }} />
        <Bar dataKey="kg" fill={SERIES} radius={[0, 4, 4, 0]} activeBar={{ fill: SERIES_HOVER }} />
      </BarChart>
    </ResponsiveContainer>
  )
}
