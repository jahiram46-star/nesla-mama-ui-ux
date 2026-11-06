import React, { useState } from 'react';
import { LogEntry } from '../types/balancer';
import { Language, translations } from '../utils/i18n';
import { Terminal, Download, Search, Trash2, Filter } from 'lucide-react';

interface LogsViewerProps {
  logs: LogEntry[];
  onClear: () => void;
  lang: Language;
}

export const LogsViewer: React.FC<LogsViewerProps> = ({ logs, onClear, lang }) => {
  const t = translations[lang];

  const [filterLevel, setFilterLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'REBALANCE'>('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.category.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `beam_lb_events_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCsv = () => {
    const headers = ['id', 'timestamp', 'level', 'category', 'message', 'details'];
    const rows = logs.map(l => [
      l.id,
      l.timestamp,
      l.level,
      l.category,
      `"${l.message.replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `beam_lb_events_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900/80 rounded-lg border border-slate-800/80 overflow-hidden flex flex-col">
      {/* Logs Controls Bar */}
      <div className="p-3.5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            {t.tabLogs}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            ({filteredLogs.length} entries)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
            {(['ALL', 'INFO', 'WARN', 'ERROR', 'REBALANCE'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  filterLevel === lvl
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-48">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Export JSON / CSV */}
          <button
            onClick={exportJson}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded transition-colors"
            title="Export as JSON"
          >
            <Download className="w-3 h-3" />
            <span>JSON</span>
          </button>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded transition-colors"
            title="Export as CSV"
          >
            <Download className="w-3 h-3" />
            <span>CSV</span>
          </button>

          {/* Clear */}
          <button
            onClick={onClear}
            className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logs Table / Stream */}
      <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/60 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-sans">
            No events match the selected filters.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isInfo = log.level === 'INFO';
            const isWarn = log.level === 'WARN';
            const isError = log.level === 'ERROR';
            const isRebalance = log.level === 'REBALANCE';

            return (
              <div key={log.id} className="p-2.5 hover:bg-slate-800/40 transition-colors flex items-start gap-3">
                <span className="text-slate-400 text-[11px] tabular-nums shrink-0 pt-0.5">
                  {log.timestamp}
                </span>

                <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded shrink-0 ${
                  isInfo ? 'text-cyan-400 bg-cyan-950/50' :
                  isWarn ? 'text-amber-400 bg-amber-950/50' :
                  isError ? 'text-rose-400 bg-rose-950/50' : 'text-emerald-400 bg-emerald-950/50'
                }`}>
                  {log.level}
                </span>

                <span className="text-slate-400 text-[11px] shrink-0 font-sans">
                  [{log.category}]
                </span>

                <div className="flex-1 font-sans text-slate-200">
                  <span>{log.message}</span>
                  {log.details && (
                    <span className="text-slate-400 font-mono text-[11px] ml-2">
                      ({log.details})
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
