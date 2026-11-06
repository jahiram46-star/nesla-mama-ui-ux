import React, { useState } from 'react';
import { XanoServerNode, NodeStatus } from '../types/balancer';
import { Language, translations } from '../utils/i18n';
import { X, Server, Database, Cpu, Activity, Clock, ShieldAlert } from 'lucide-react';

interface NodeDetailModalProps {
  node: XanoServerNode | null;
  onClose: () => void;
  onUpdateNode: (updated: XanoServerNode) => void;
  lang: Language;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onUpdateNode,
  lang
}) => {
  if (!node) return null;
  const t = translations[lang];

  const [weight, setWeight] = useState(node.weight);
  const [status, setStatus] = useState<NodeStatus>(node.status);
  const [chaosLag, setChaosLag] = useState(node.chaosLagMs);

  const handleSave = () => {
    onUpdateNode({
      ...node,
      weight,
      status,
      chaosLagMs: chaosLag
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              {node.id.toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {node.name}
              </h3>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{node.host}</span>
                <span aria-hidden="true">·</span>
                <span>{node.region} {node.flag}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-emerald-400">{node.erlangPid}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Status & Telemetry Strip */}
          <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-950/60 rounded-md border border-slate-800/60">
            <div>
              <div className="text-slate-400 text-[11px] mb-0.5">{t.qps}</div>
              <div className="text-base font-bold font-mono text-white tabular-nums">
                {node.qps} <span className="text-xs text-slate-400 font-normal">req/s</span>
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px] mb-0.5">{t.latency} (P95)</div>
              <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                {node.p95LatencyMs + node.chaosLagMs} <span className="text-xs text-slate-400 font-normal">ms</span>
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px] mb-0.5">{t.connections}</div>
              <div className="text-base font-bold font-mono text-cyan-400 tabular-nums">
                {node.activeConnections} <span className="text-xs text-slate-400 font-normal">active</span>
              </div>
            </div>
          </div>

          {/* Database Pool & System Metrics */}
          <div className="p-3 bg-slate-950/40 rounded-md border border-slate-800/40 space-y-3">
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>PostgreSQL Connection Pool & Resource Utilization</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Postgres Pool</span>
                  <span className="font-mono text-slate-200">{node.dbPoolCurrent} / {node.dbPoolMax}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(node.dbPoolCurrent / node.dbPoolMax) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>CPU Load</span>
                  <span className="font-mono text-slate-200">{node.cpuPercent}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${node.cpuPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Controls: Weight & Status */}
          <div className="space-y-3 pt-2 border-t border-slate-800/60">
            {/* Status Selector */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Node Operational Status
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['healthy', 'degraded', 'draining', 'offline'] as NodeStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-1.5 px-2 text-xs font-medium rounded capitalize border transition-colors ${
                      status === st
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{t.adjustWeight}</span>
                <span className="font-mono font-bold text-emerald-400">{weight}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Higher weights receive proportionately more requests in Weighted EWMA and Least Connections algorithms.
              </p>
            </div>

            {/* Chaos Lag Injection */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Artificial Latency Injection (Chaos Testing)</span>
                </span>
                <span className="font-mono font-bold text-amber-400">+{chaosLag} ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="25"
                value={chaosLag}
                onChange={(e) => setChaosLag(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Simulates database locks or slow external API calls in Xano to test dynamic shedding.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded transition-colors"
          >
            {t.close}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded transition-colors shadow-sm"
          >
            {t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};
