import React from 'react';
import { ErlangClusterTelemetry, XanoServerNode } from '../types/balancer';
import { Language, translations } from '../utils/i18n';
import { Cpu, Layers, GitBranch, ShieldCheck, Database, HardDrive, Terminal } from 'lucide-react';

interface ErlangBeamInspectorProps {
  telemetry: ErlangClusterTelemetry;
  nodes: XanoServerNode[];
  lang: Language;
}

export const ErlangBeamInspector: React.FC<ErlangBeamInspectorProps> = ({
  telemetry,
  nodes,
  lang
}) => {
  const t = translations[lang];

  const etsTables = [
    { name: 'beam_lb_conn_counters', type: 'set', objects: nodes.length, memoryKb: 14.2, concurrency: 'read/write' },
    { name: 'beam_lb_health_state', type: 'set', objects: nodes.length, memoryKb: 8.6, concurrency: 'read' },
    { name: 'beam_lb_ewma_cache', type: 'ordered_set', objects: nodes.length * 3, memoryKb: 28.4, concurrency: 'write' },
    { name: 'beam_rate_limiter_buckets', type: 'set', objects: 1240, memoryKb: 96.1, concurrency: 'write' },
    { name: 'beam_session_affinity_ring', type: 'bag', objects: 256, memoryKb: 44.8, concurrency: 'read' }
  ];

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-mono text-emerald-400 font-bold">{telemetry.beamNode}</span>
              <span aria-hidden="true">·</span>
              <span>{telemetry.otpVersion}</span>
            </div>
            <h3 className="text-base font-bold text-white">
              {t.beamTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.beamDesc}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-2 bg-slate-950 rounded border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">BEAM Memory</div>
              <div className="font-mono font-bold text-sm text-cyan-400 tabular-nums">
                {telemetry.memoryAllocatedMb} MB
              </div>
            </div>
            <div className="px-3 py-2 bg-slate-950 rounded border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Run Queue</div>
              <div className="font-mono font-bold text-sm text-emerald-400 tabular-nums">
                {telemetry.runQueueDepth} msg
              </div>
            </div>
            <div className="px-3 py-2 bg-slate-950 rounded border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Micro Processes</div>
              <div className="font-mono font-bold text-sm text-indigo-400 tabular-nums">
                {telemetry.activeBeamProcesses.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Supervision Hierarchy & Schedulers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Supervision Tree */}
        <div className="lg:col-span-7 p-4 bg-slate-900/80 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <span>{t.supervisorTree} (one_for_one Strategy)</span>
            </h4>

            {/* Visual Tree */}
            <div className="p-3.5 bg-slate-950/70 rounded-md border border-slate-800/60 font-mono text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="text-slate-500">▶</span>
                <span>beam_lb_sup</span>
                <span className="text-[10px] text-slate-400 font-normal">&lt;0.1200.0&gt; (Root Supervisor)</span>
              </div>

              <div className="pl-5 space-y-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">├──</span>
                  <span className="text-cyan-300">beam_lb_dispatcher</span>
                  <span className="text-[10px] text-slate-400">&lt;0.1205.0&gt; (gen_server: routing engine)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">├──</span>
                  <span className="text-cyan-300">beam_health_prober</span>
                  <span className="text-[10px] text-slate-400">&lt;0.1208.0&gt; (probes 20 Xano /api:health every 2.5s)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">├──</span>
                  <span className="text-cyan-300">beam_metrics_ets</span>
                  <span className="text-[10px] text-slate-400">&lt;0.1212.0&gt; (atomic counters & latency histogram)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">├──</span>
                  <span className="text-cyan-300">beam_circuit_breaker</span>
                  <span className="text-[10px] text-slate-400">&lt;0.1215.0&gt; (CoDel adaptive load shedder)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">└──</span>
                  <span className="text-indigo-400 font-semibold">beam_xano_worker_sup</span>
                  <span className="text-[10px] text-slate-400">&lt;0.1400.0&gt; (simple_one_for_one: 20 node connection pools)</span>
                </div>

                <div className="pl-6 border-l border-slate-800/60 text-[11px] text-slate-400 space-y-0.5">
                  <div>• xano-01 &lt;0.1401.0&gt; to xano-20 &lt;0.1420.0&gt; dedicated worker pools</div>
                  <div>• Automatic instant restart in &lt;100μs on network socket crashes</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>If any worker process handling a Xano server crashes, Erlang supervisor restarts it instantly without impacting other nodes.</span>
          </div>
        </div>

        {/* Schedulers & Resource Allocation */}
        <div className="lg:col-span-5 p-4 bg-slate-900/80 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>{t.schedulerUtilization} ({telemetry.schedulersOnline} SMP Threads)</span>
            </h4>

            {/* Schedulers grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {Array.from({ length: 16 }).map((_, idx) => {
                const util = Math.min(95, Math.max(15, Math.round(telemetry.schedulerUtilization + (Math.sin(idx) * 8))));
                return (
                  <div key={idx} className="p-2 bg-slate-950/70 rounded border border-slate-800/60 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">SCH #{idx + 1}</div>
                    <div className="text-xs font-mono font-bold text-slate-100 tabular-nums">
                      {util}%
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${util}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Memory segments */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>BEAM Process Heap</span>
                <span className="font-mono text-slate-200">68.2 MB</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ETS Storage (Lockless Tables)</span>
                <span className="font-mono text-slate-200">42.5 MB</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Binary Heap (Large Request Bodies)</span>
                <span className="font-mono text-slate-200">26.8 MB</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Atom & Code Space</span>
                <span className="font-mono text-slate-200">11.1 MB</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Garbage Collection is per-process; zero global stop-the-world pauses.</span>
          </div>
        </div>
      </div>

      {/* ETS Tables Overview */}
      <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800/80">
        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>{t.etsTables} (Erlang In-Memory Fast Cache)</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-3 py-2 font-medium">Table Identifier</th>
                <th className="px-3 py-2 font-medium">Data Structure</th>
                <th className="px-3 py-2 font-medium text-right">Active Records</th>
                <th className="px-3 py-2 font-medium text-right">RAM Allocated</th>
                <th className="px-3 py-2 font-medium text-right">Concurrency Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {etsTables.map((tbl, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="px-3 py-2 text-emerald-400 font-semibold">{tbl.name}</td>
                  <td className="px-3 py-2 text-slate-400">{tbl.type}</td>
                  <td className="px-3 py-2 text-right text-slate-200 tabular-nums">{tbl.objects}</td>
                  <td className="px-3 py-2 text-right text-slate-200 tabular-nums">{tbl.memoryKb} KB</td>
                  <td className="px-3 py-2 text-right text-cyan-400">{tbl.concurrency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
