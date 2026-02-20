import { useState } from 'react'
import type { ChartPoint } from '../hooks/useStats'
import './LineChart.css'

interface Props {
  data: ChartPoint[]
  formatY: (v: number) => string
  yLabel: string
  emptyText: string
}

const W = 600
const H = 180
const PAD = { top: 16, right: 16, bottom: 32, left: 48 }
const INNER_W = W - PAD.left - PAD.right
const INNER_H = H - PAD.top - PAD.bottom

export function LineChart({ data, formatY, yLabel, emptyText }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  if (data.length === 0) {
    return (
      <div className="line-chart line-chart--empty">
        <span className="line-chart__empty">{emptyText}</span>
      </div>
    )
  }

  if (data.length === 1) {
    // Single point — just show it centered
    const pt = data[0]
    return (
      <div className="line-chart line-chart--single">
        <span className="line-chart__single-value">{formatY(pt.value)}</span>
        <span className="line-chart__single-date">{pt.date}</span>
      </div>
    )
  }

  const values = data.map(d => d.value)
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const rangeV = maxV - minV || 1

  const sx = (i: number) => PAD.left + (i / (data.length - 1)) * INNER_W
  const sy = (v: number) => PAD.top + INNER_H - ((v - minV) / rangeV) * INNER_H

  const pathD = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${sx(i).toFixed(1)} ${sy(d.value).toFixed(1)}`)
    .join(' ')

  // Y-axis tick values
  const yTicks = [minV, (minV + maxV) / 2, maxV]

  // X-axis: show first and last date, and maybe mid
  const xLabels = [
    { i: 0, label: data[0].date.slice(5) },
    { i: data.length - 1, label: data[data.length - 1].date.slice(5) },
  ]

  const hoveredPoint = hovered !== null ? data[hovered] : null

  return (
    <div className="line-chart">
      <span className="line-chart__y-label">{yLabel}</span>
      <svg
        className="line-chart__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis ticks */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={PAD.left - 4} y1={sy(v)}
              x2={PAD.left}     y2={sy(v)}
              stroke="var(--border-hover)" strokeWidth={1}
            />
            <text
              x={PAD.left - 8} y={sy(v)}
              textAnchor="end" dominantBaseline="middle"
              className="line-chart__axis-text"
            >
              {formatY(Math.round(v))}
            </text>
          </g>
        ))}

        {/* X-axis baseline */}
        <line
          x1={PAD.left} y1={PAD.top + INNER_H}
          x2={PAD.left + INNER_W} y2={PAD.top + INNER_H}
          stroke="var(--border-subtle)" strokeWidth={1}
        />

        {/* X-axis labels */}
        {xLabels.map(({ i, label }) => (
          <text
            key={i}
            x={sx(i)} y={PAD.top + INNER_H + 18}
            textAnchor={i === 0 ? 'start' : 'end'}
            className="line-chart__axis-text"
          >
            {label}
          </text>
        ))}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--orange-primary)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Gradient fill under line */}
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--orange-primary)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--orange-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L ${sx(data.length - 1).toFixed(1)} ${(PAD.top + INNER_H).toFixed(1)} L ${PAD.left.toFixed(1)} ${(PAD.top + INNER_H).toFixed(1)} Z`}
          fill="url(#chart-fill)"
        />

        {/* Data points (interactive) */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={sx(i)} cy={sy(d.value)}
            r={hovered === i ? 5 : 3}
            fill={hovered === i ? 'var(--orange-primary)' : 'var(--bg-deep)'}
            stroke="var(--orange-primary)"
            strokeWidth={2}
            style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* Hover tooltip */}
        {hoveredPoint && hovered !== null && (
          <g>
            <line
              x1={sx(hovered)} y1={PAD.top}
              x2={sx(hovered)} y2={PAD.top + INNER_H}
              stroke="var(--border-hover)" strokeWidth={1} strokeDasharray="3,3"
            />
            <rect
              x={sx(hovered) - 52}
              y={sy(hoveredPoint.value) - 36}
              width={104} height={28}
              rx={6}
              fill="var(--bg-card)"
              stroke="var(--border-hover)"
            />
            <text
              x={sx(hovered)} y={sy(hoveredPoint.value) - 26}
              textAnchor="middle" dominantBaseline="middle"
              className="line-chart__tooltip-text"
            >
              {hoveredPoint.label}
            </text>
            <text
              x={sx(hovered)} y={sy(hoveredPoint.value) - 13}
              textAnchor="middle" dominantBaseline="middle"
              className="line-chart__tooltip-date"
            >
              {hoveredPoint.date.slice(5)}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
