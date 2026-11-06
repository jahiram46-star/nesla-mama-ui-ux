import React from 'react';
import { XanoServerNode, ErlangClusterTelemetry } from '../types/balancer';
import { Language, translations } from '../utils/i18n';
import { Server, Zap, Clock, Cpu, Activity } from 'lucide-react';

interface ClusterKpisProps {
  nodes: XanoServerNode[];
  telemetry: ErlangClusterTelemetry;
  lang: Language;
}

export const ClusterKpis: React.FC<ClusterKpisProps> = ({ nodes, telemetry, lang }) => {
  const t = translations[lang];

  const healthyCount = nodes.filter(n => n.status === 'healthy').length;
  const degradedCount = nodes.filter(n => n.status === 'degraded').length;
  const drainingCount = nodes.filter(n => n.status === 'draining').length;
  const offlineCount = nodes.filter(n => n.status === 'offline').length;
  const totalCount = nodes.length; // 20

  const activeNodes = nodes.filter(n => n.status !== 'offline');
  const latencies = activeNodes.map(n => n.latencyMs + n.chaosLagMs).sort((a, b) => a - b);
  const p95Latency = latencies[Math.floor(latencies.length * 0.95)] || 24;

  const kpis = [
    {
      label: t.healthyNodes,
      value: `${healthyCount}/${totalCount}`,
      sub: `${degradedCount > 0 ? `${degradedCount} degraded · ` : ''}${offlineCount > 0 ? `${offlineCount} offline` : 'All nominal'}`,
      icon: Server,
      accent: healthyCount === totalCount ? 'text-emerald-400' : 'text-amber-400',
      tag: 'Cluster Health'
    },
    {
      label: t.clusterThroughput,
      value: `${telemetry.totalRps.toLocaleString()}`,
      sub: `Peak: ${telemetry.peakRps.toLocaleString()} QPS · target adaptive`,
      unit: 'req/s',
      icon: Zap,
      accent: 'text-cyan-400',
      tag: 'Throughput'
    },
    {
      label: t.clusterLatencyP95,
      value: `${p95Latency}`,
      sub: 'Erlang round-trip prober EWMA',
      unit: 'ms',
      icon: Clock,
      accent: p95Latency < 50 ? 'text-emerald-400' : 'text-amber-400',
      tag: 'Response Time'
    },
    {
      label: t.beamProcesses,
      value: `${telemetry.activeBeamProcesses.toLocaleString()}`,
      sub: `${telemetry.schedulersOnline} Schedulers · Queue: ${telemetry.runQueueDepth}`,
      icon: Cpu,
      accent: 'text-indigo-400',
      tag: 'Erlang OTP'
    },
    {
      label: t.totalRequests,
      value: `${(telemetry.totalRequestsHandled / 1000).toFixed(1)}k`,
      sub: `BEAM Uptime: ${Math.floor(telemetry.uptimeSeconds / 3600)}h ${Math.floor((telemetry.uptimeSeconds % 3600) / 60)}m`,
      icon: Activity,
      accent: 'text-emerald-400',
      tag: 'Dispatched'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium truncate">{kpi.label}</span>
              <Icon className={`w-4 h-4 ${kpi.accent} shrink-0`} />
            </div>
            
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="text-xs font-mono text-slate-400">
                  {kpi.unit}
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-400 truncate">
              {kpi.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
};
