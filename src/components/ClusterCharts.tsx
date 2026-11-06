import React from 'react';
import { MetricsPoint, XanoServerNode } from '../types/balancer';
import { Language, translations } from '../utils/i18n';
import { TrendingUp, Clock, BarChart3, Activity } from 'lucide-react';

interface ClusterChartsProps {
  history: MetricsPoint[];
  nodes: XanoServerNode[];
  lang: Language;
}

export const ClusterCharts: React.FC<ClusterChartsProps> = ({
  history,
  nodes,
  lang
}) => {
  const t = translations[lang];

  // Calculate chart boundaries
  const maxRps = Math.max(...history.map(h => h.rps), 500) * 1.15;
  const maxLatency = Math.max(...history.map(h => h.p99), 100) * 1.2;

  // Max QPS among 20 nodes for relative bar heights
  const maxNodeQps = Math.max(...nodes.map(n => n.qps), 10) * 1.15;

  return (
    <div className="space-y-4">
      {/* 2-Column charts: RPS & Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Cluster Throughput (RPS) */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cluster Throughput (Rolling 30s)</span>
              </h4>
              <span className="text-xs font-mono text-cyan-400 font-bold tabular-nums">
                {history[history.length - 1]?.rps || 0} req/s
              </span>
            </div>

            {/* SVG Line / Area Chart */}
            <div className="h-44 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="rpsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={150 - ratio * 140}
                    x2="500"
                    y2={150 - ratio * 140}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Area path */}
                {history.length > 1 && (
                  <>
                    <path
                      d={
                        history.map((pt, idx) => {
                          const x = (idx / (history.length - 1)) * 500;
                          const y = 145 - (pt.rps / maxRps) * 135;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ') + ` L 500 150 L 0 150 Z`
                      }
                      fill="url(#rpsGradient)"
                    />
                    {/* Line path */}
                    <path
                      d={history.map((pt, idx) => {
                        const x = (idx / (history.length - 1)) * 500;
                        const y = 145 - (pt.rps / maxRps) * 135;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
            <span>-30s</span>
            <span>-15s</span>
            <span>Now</span>
          </div>
        </div>

        {/* Chart 2: Latency Percentiles (P50, P95, P99) */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Response Latency Distribution</span>
              </h4>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-emerald-400">P50: {history[history.length - 1]?.p50 || 0}ms</span>
                <span className="text-amber-400">P95: {history[history.length - 1]?.p95 || 0}ms</span>
                <span className="text-rose-400">P99: {history[history.length - 1]?.p99 || 0}ms</span>
              </div>
            </div>

            {/* SVG Multi-line Chart */}
            <div className="h-44 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                {/* Gridlines */}
                {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={150 - ratio * 140}
                    x2="500"
                    y2={150 - ratio * 140}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {history.length > 1 && (
                  <>
                    {/* P99 Line (Rose) */}
                    <path
                      d={history.map((pt, idx) => {
                        const x = (idx / (history.length - 1)) * 500;
                        const y = 145 - (pt.p99 / maxLatency) * 135;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />

                    {/* P95 Line (Amber) */}
                    <path
                      d={history.map((pt, idx) => {
                        const x = (idx / (history.length - 1)) * 500;
                        const y = 145 - (pt.p95 / maxLatency) * 135;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.75"
                    />

                    {/* P50 Line (Emerald) */}
                    <path
                      d={history.map((pt, idx) => {
                        const x = (idx / (history.length - 1)) * 500;
                        const y = 145 - (pt.p50 / maxLatency) * 135;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-emerald-500 inline-block" /> P50 Median
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-amber-500 inline-block" /> P95 Tail
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-rose-500 inline-block" /> P99 Worst
            </span>
          </div>
        </div>
      </div>

      {/* 20 Nodes Load Distribution Bar Chart */}
      <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>20 Xano Backend Node Traffic Balancing Spectrum</span>
          </h4>
          <span className="text-xs text-slate-400">
            Relative QPS Distribution Across All 20 Instances
          </span>
        </div>

        {/* 20 Columns Bar Chart */}
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 items-end h-36 pt-4 px-1 pb-1 bg-slate-950/60 rounded-md border border-slate-800/60">
          {nodes.map((n, idx) => {
            const heightPercent = Math.max(4, Math.min(100, (n.qps / maxNodeQps) * 100));
            const isOffline = n.status === 'offline';
            const isDegraded = n.status === 'degraded';

            return (
              <div key={n.id} className="flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 border border-slate-700 text-slate-100 text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                  <span className="font-bold">{n.id.toUpperCase()}: {n.qps} QPS</span>
                  <span className="text-slate-400">{n.activeConnections} active conn · {n.latencyMs}ms</span>
                </div>

                {/* The Bar */}
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    isOffline
                      ? 'bg-slate-800'
                      : isDegraded
                      ? 'bg-amber-500 hover:bg-amber-400'
                      : 'bg-emerald-500 hover:bg-emerald-400'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Node Number Label */}
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  {idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>Node 01 (Core Auth)</span>
          <span>Node 10 (EU Central)</span>
          <span>Node 20 (Hot Standby)</span>
        </div>
      </div>
    </div>
  );
};
