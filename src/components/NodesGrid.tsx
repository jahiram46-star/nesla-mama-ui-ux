import React, { useState } from 'react';
import { XanoServerNode } from '../types/balancer';
import { NodeCard } from './NodeCard';
import { Language, translations } from '../utils/i18n';
import { Search, Server, ShieldCheck, Filter } from 'lucide-react';

interface NodesGridProps {
  nodes: XanoServerNode[];
  onDrainToggle: (id: string) => void;
  onStatusToggle: (id: string) => void;
  onLagToggle: (id: string) => void;
  onInspect: (node: XanoServerNode) => void;
  lang: Language;
}

export const NodesGrid: React.FC<NodesGridProps> = ({
  nodes,
  onDrainToggle,
  onStatusToggle,
  onLagToggle,
  onInspect,
  lang
}) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | 'healthy' | 'degraded' | 'draining' | 'offline'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredNodes = nodes.filter((n) => {
    // Status filter
    if (filter !== 'all' && n.status !== filter) return false;
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = n.id.toLowerCase().includes(q);
      const matchName = n.name.toLowerCase().includes(q);
      const matchHost = n.host.toLowerCase().includes(q);
      const matchRegion = n.region.toLowerCase().includes(q);
      const matchTags = n.tags.some(t => t.toLowerCase().includes(q));
      return matchId || matchName || matchHost || matchRegion || matchTags;
    }
    return true;
  });

  const healthyCount = nodes.filter(n => n.status === 'healthy').length;
  const degradedCount = nodes.filter(n => n.status === 'degraded').length;
  const drainingCount = nodes.filter(n => n.status === 'draining').length;
  const offlineCount = nodes.filter(n => n.status === 'offline').length;

  return (
    <div className="space-y-4">
      {/* Header bar of the grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900/80 rounded-lg border border-slate-800/80">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            {t.tabNodes}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            ({filteredNodes.length}/{nodes.length} {t.filterHealthy})
          </span>
          <span className="text-xs text-slate-400 hidden md:inline">
            · {t.nodeMaxNotice}
          </span>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* Segmented Filter Buttons (Buttons, not pills) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/60 rounded-md border border-slate-800/60">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            filter === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.filterAll} ({nodes.length})
        </button>

        <button
          onClick={() => setFilter('healthy')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            filter === 'healthy'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.filterHealthy} ({healthyCount})
        </button>

        <button
          onClick={() => setFilter('degraded')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            filter === 'degraded'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.filterDegraded} ({degradedCount})
        </button>

        <button
          onClick={() => setFilter('draining')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            filter === 'draining'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.filterDraining} ({drainingCount})
        </button>

        <button
          onClick={() => setFilter('offline')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            filter === 'offline'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.filterOffline} ({offlineCount})
        </button>
      </div>

      {/* Grid of the 20 Xano Nodes */}
      {filteredNodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredNodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              onDrainToggle={onDrainToggle}
              onStatusToggle={onStatusToggle}
              onLagToggle={onLagToggle}
              onInspect={onInspect}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900/40 rounded-lg border border-slate-800 text-slate-400 text-sm">
          No Xano nodes match the current filter or search criteria.
        </div>
      )}
    </div>
  );
};
