import React from 'react';
import { BalancingAlgorithm, TrafficPattern } from '../types/balancer';
import { Language, translations } from '../utils/i18n';
import { Sliders, Shuffle, AlertOctagon, RefreshCw, Info } from 'lucide-react';

interface AlgorithmControlsProps {
  algorithm: BalancingAlgorithm;
  onChangeAlgorithm: (algo: BalancingAlgorithm) => void;
  targetRps: number;
  onChangeRps: (rps: number) => void;
  pattern: TrafficPattern;
  onChangePattern: (pattern: TrafficPattern) => void;
  onChaosTrigger: () => void;
  onRestoreAll: () => void;
  lang: Language;
}

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  algorithm,
  onChangeAlgorithm,
  targetRps,
  onChangeRps,
  pattern,
  onChangePattern,
  onChaosTrigger,
  onRestoreAll,
  lang
}) => {
  const t = translations[lang];

  const algorithms: { id: BalancingAlgorithm; label: string; desc: string }[] = [
    {
      id: 'round_robin',
      label: t.algoRoundRobin,
      desc: 'Simple cyclic atomic counter across the 20 Xano servers using Erlang ETS atomic increment.'
    },
    {
      id: 'least_conn',
      label: t.algoLeastConn,
      desc: 'Routes to backend with min active in-flight requests / weight. Ideal for heavy Xano Postgres queries.'
    },
    {
      id: 'weighted_ewma',
      label: t.algoWeightedEWMA,
      desc: 'Peak Exponentially Weighted Moving Average. Prioritizes low-latency nodes, avoiding tail latency.'
    },
    {
      id: 'consistent_hash',
      label: t.algoConsistentHash,
      desc: 'Hashes client IP / auth token to pin user sessions to specific Xano nodes for memory cache locality.'
    },
    {
      id: 'resource_aware',
      label: t.algoResourceAware,
      desc: 'Evaluates Xano CPU load & Postgres connection pool depth to prevent DB connection exhaustion.'
    },
    {
      id: 'adaptive_codel',
      label: t.algoAdaptiveCoDel,
      desc: 'Active queue management (Controlled Delay). Sheds or routes around saturated nodes.'
    }
  ];

  const patterns: { id: TrafficPattern; label: string }[] = [
    { id: 'steady', label: t.patternSteady },
    { id: 'burst', label: t.patternBurst },
    { id: 'sinusoidal', label: t.patternSinusoidal },
    { id: 'chaos', label: t.patternChaos }
  ];

  const activeAlgo = algorithms.find(a => a.id === algorithm) || algorithms[0];

  return (
    <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col gap-4">
      {/* Top row: Algorithm segmented selector */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
            {t.balancingAlgorithm}
          </span>
          <span className="text-[11px] text-slate-400">
            Managed Cluster: 20 Xano Backends
          </span>
        </div>

        {/* Algorithm buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 p-1 bg-slate-950/80 rounded-md border border-slate-800/60">
          {algorithms.map((algo) => {
            const isSelected = algorithm === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => onChangeAlgorithm(algo.id)}
                className={`px-3 py-2 text-xs font-medium rounded transition-colors text-center truncate ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title={algo.desc}
              >
                {algo.label}
              </button>
            );
          })}
        </div>

        {/* Algorithm info note */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded border border-slate-800/40">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{activeAlgo.desc}</span>
        </div>
      </div>

      {/* Bottom row: Traffic Generator Controls */}
      <div className="pt-2 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Target RPS slider */}
        <div className="md:col-span-5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-emerald-400" />
              {t.targetRps}
            </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {targetRps.toLocaleString()} <span className="text-slate-400 font-normal">req/s</span>
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="2500"
            step="50"
            value={targetRps}
            onChange={(e) => onChangeRps(Number(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Traffic pattern selector */}
        <div className="md:col-span-4 flex flex-col gap-1.5">
          <span className="text-xs text-slate-400">{t.pattern}</span>
          <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded border border-slate-800/60">
            {patterns.map((p) => {
              const isActive = pattern === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onChangePattern(p.id)}
                  className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors text-center truncate ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick chaos & healing actions */}
        <div className="md:col-span-3 flex items-center gap-2 justify-end">
          <button
            onClick={onChaosTrigger}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition-colors whitespace-nowrap"
            title="Simulate random Xano node failure to test Erlang OTP supervisor and failover"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Chaos Test</span>
          </button>

          <button
            onClick={onRestoreAll}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded transition-colors whitespace-nowrap"
            title="Restore all 20 nodes to healthy status"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Heal All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
