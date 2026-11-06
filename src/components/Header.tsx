import React from 'react';
import { Language, translations } from '../utils/i18n';
import { Play, Pause, FileCode, RotateCcw } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onOpenConfig: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  isRunning,
  onToggleRunning,
  onReset,
  onOpenConfig,
  activeTab,
  onSelectTab
}) => {
  const t = translations[lang];

  const navItems = [
    { id: 'nodes', label: t.tabNodes },
    { id: 'dispatcher', label: t.tabDispatcher },
    { id: 'metrics', label: t.tabMetrics },
    { id: 'beam', label: t.tabBeam },
    { id: 'logs', label: t.tabLogs }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
            BL
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              {t.appTitle}
            </span>
            <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
              {t.appSubtitle}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors whitespace-nowrap"
            title="Toggle Language (বাংলা / English)"
          >
            {t.language}
          </button>

          {/* Erlang Config Modal Trigger */}
          <button
            onClick={onOpenConfig}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors whitespace-nowrap"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>sys.config</span>
          </button>

          {/* Reset Cluster State */}
          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors"
            title={t.resetCluster}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Primary Action: Run / Pause Engine */}
          <button
            onClick={onToggleRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors shadow-sm whitespace-nowrap ${
              isRunning
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>{t.pauseSimulation}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.resumeSimulation}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-800/80 bg-slate-950 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
