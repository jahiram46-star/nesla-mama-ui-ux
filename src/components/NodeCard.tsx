import React from 'react';
import { XanoServerNode } from '../types/balancer';
import { Language, translations } from '../utils/i18n';
import { Database, Activity, Wifi, WifiOff, ShieldAlert, Cpu } from 'lucide-react';

interface NodeCardProps {
  node: XanoServerNode;
  onDrainToggle: (id: string) => void;
  onStatusToggle: (id: string) => void;
  onLagToggle: (id: string) => void;
  onInspect: (node: XanoServerNode) => void;
  lang: Language;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  onDrainToggle,
  onStatusToggle,
  onLagToggle,
  onInspect,
  lang
}) => {
  const t = translations[lang];

  // Status visual attributes
  const isHealthy = node.status === 'healthy';
  const isDegraded = node.status === 'degraded';
  const isDraining = node.status === 'draining';
  const isOffline = node.status === 'offline';

  const statusLabel = 
    node.status === 'healthy' ? t.filterHealthy :
    node.status === 'degraded' ? t.filterDegraded :
    node.status === 'draining' ? t.filterDraining : t.filterOffline;

  const statusColorClass = 
    isHealthy ? 'text-emerald-400 border-emerald-500/30' :
    isDegraded ? 'text-amber-400 border-amber-500/30' :
    isDraining ? 'text-blue-400 border-blue-500/30' : 'text-rose-400 border-rose-500/30';

  const totalEffectiveLatency = node.latencyMs + node.chaosLagMs;

  return (
    <div
      className={`p-4 rounded-lg bg-slate-900/90 border transition-all flex flex-col justify-between ${
        isOffline
          ? 'border-slate-800/60 opacity-60 bg-slate-950/40'
          : isDegraded
          ? 'border-amber-500/40 hover:border-amber-500/60'
          : 'border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      <div>
        {/* Card Header: Node ID, Name, Region, Status text */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
              <span className="font-mono font-bold text-white tracking-wider">{node.id.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{node.region} {node.flag}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px] text-slate-400">{node.erlangPid}</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100 truncate" title={node.name}>
              {node.name}
            </h4>
          </div>

          {/* Status Label (Clean unboxed text paired with icon) */}
          <div className={`flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded border ${statusColorClass} shrink-0`}>
            {isHealthy && <Activity className="w-3 h-3 text-emerald-400" />}
            {isDegraded && <ShieldAlert className="w-3 h-3 text-amber-400" />}
            {isDraining && <WifiOff className="w-3 h-3 text-blue-400" />}
            {isOffline && <WifiOff className="w-3 h-3 text-rose-400" />}
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Primary Metrics 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-slate-950/70 rounded-md border border-slate-800/60 text-xs">
          <div>
            <div className="text-[11px] text-slate-400 mb-0.5">{t.qps}</div>
            <div className="font-mono font-bold text-slate-100 text-sm tabular-nums">
              {node.qps} <span className="text-[10px] text-slate-400 font-normal">req/s</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 mb-0.5">{t.latency} (avg)</div>
            <div className={`font-mono font-bold text-sm tabular-nums ${
              totalEffectiveLatency > 100 ? 'text-rose-400' : totalEffectiveLatency > 50 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {totalEffectiveLatency} <span className="text-[10px] text-slate-400 font-normal">ms</span>
              {node.chaosLagMs > 0 && <span className="text-[10px] text-amber-400 ml-1">+{node.chaosLagMs}ms</span>}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 mb-0.5">{t.connections}</div>
            <div className="font-mono font-medium text-slate-200 tabular-nums">
              {node.activeConnections} <span className="text-[10px] text-slate-400">in-flight</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 mb-0.5">{t.weight} / Load</div>
            <div className="font-mono font-medium text-slate-200 tabular-nums">
              {node.weight}x <span className="text-[10px] text-slate-400">weight</span>
            </div>
          </div>
        </div>

        {/* Resource Bars: CPU & Postgres DB Pool */}
        <div className="space-y-2 mb-3 text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" />
                <span>{t.cpu}</span>
              </span>
              <span className="font-mono tabular-nums text-slate-300">{node.cpuPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  node.cpuPercent > 80 ? 'bg-rose-500' : node.cpuPercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${node.cpuPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-slate-400" />
                <span>{t.dbPool}</span>
              </span>
              <span className="font-mono tabular-nums text-slate-300">
                {node.dbPoolCurrent}/{node.dbPoolMax}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  node.dbPoolCurrent / node.dbPoolMax > 0.85
                    ? 'bg-rose-500'
                    : node.dbPoolCurrent / node.dbPoolMax > 0.6
                    ? 'bg-amber-500'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(100, (node.dbPoolCurrent / node.dbPoolMax) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls Row */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1.5">
        {/* Drain / Undrain */}
        <button
          onClick={() => onDrainToggle(node.id)}
          className={`flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors truncate ${
            isDraining
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
          }`}
          title="Gracefully drain connections before maintenance"
        >
          {isDraining ? t.undrain : t.drain}
        </button>

        {/* Offline / Online */}
        <button
          onClick={() => onStatusToggle(node.id)}
          className={`flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors truncate ${
            isOffline
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
          }`}
          title="Simulate complete node failure or restore"
        >
          {isOffline ? t.revive : t.kill}
        </button>

        {/* Lag toggle */}
        <button
          onClick={() => onLagToggle(node.id)}
          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
            node.chaosLagMs > 0
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 bg-slate-800'
          }`}
          title="Inject +200ms latency to test EWMA rerouting"
        >
          {node.chaosLagMs > 0 ? t.clearLag : t.injectLag}
        </button>

        {/* Inspect Details */}
        <button
          onClick={() => onInspect(node)}
          className="px-2 py-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
        >
          {t.viewDetails}
        </button>
      </div>
    </div>
  );
};
