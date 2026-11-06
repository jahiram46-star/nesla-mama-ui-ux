import React, { useState } from 'react';
import { XanoServerNode, BalancingAlgorithm } from '../types/balancer';
import { generateSysConfig, generateErlangDispatcherModule } from '../utils/erlangConfigGen';
import { Language, translations } from '../utils/i18n';
import { X, Copy, Check, FileCode, Code2 } from 'lucide-react';

interface ErlangConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: XanoServerNode[];
  algorithm: BalancingAlgorithm;
  lang: Language;
}

export const ErlangConfigModal: React.FC<ErlangConfigModalProps> = ({
  isOpen,
  onClose,
  nodes,
  algorithm,
  lang
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'sys' | 'erl'>('sys');
  const [copied, setCopied] = useState(false);

  const sysConfig = generateSysConfig(nodes, algorithm);
  const erlangModule = generateErlangDispatcherModule(algorithm);

  const contentToCopy = activeTab === 'sys' ? sysConfig : erlangModule;

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                {t.rebarConfigTitle}
              </h3>
              <p className="text-xs text-slate-400">
                Generated Erlang OTP term files for your 20 Xano servers cluster
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch & Copy button */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sys')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                activeTab === 'sys'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              sys.config (Cluster Spec)
            </button>
            <button
              onClick={() => setActiveTab('erl')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                activeTab === 'erl'
                  ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              beam_lb_dispatcher.erl (GenServer)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyConfig}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 overflow-auto flex-1 font-mono text-xs text-slate-300">
          <pre className="leading-relaxed whitespace-pre selection:bg-emerald-500/30 selection:text-white">
            {contentToCopy}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span>Place in `config/sys.config` and compile with `rebar3 compile`.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
