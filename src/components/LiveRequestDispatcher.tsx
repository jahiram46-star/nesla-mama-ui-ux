import React, { useState } from 'react';
import { DispatchedRequest, BalancingAlgorithm, XanoServerNode } from '../types/balancer';
import { Language, translations } from '../utils/i18n';
import { Send, Zap, Trash2, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface LiveRequestDispatcherProps {
  dispatchedList: DispatchedRequest[];
  onSendSingle: (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', ip: string) => void;
  onSendBatch: (endpoint: string, count: number) => void;
  onClear: () => void;
  algorithm: BalancingAlgorithm;
  nodes: XanoServerNode[];
  lang: Language;
}

export const LiveRequestDispatcher: React.FC<LiveRequestDispatcherProps> = ({
  dispatchedList,
  onSendSingle,
  onSendBatch,
  onClear,
  algorithm,
  nodes,
  lang
}) => {
  const t = translations[lang];

  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [endpoint, setEndpoint] = useState('/api:query/table_customers');
  const [clientIp, setClientIp] = useState('192.168.1.104');

  const presetEndpoints = [
    '/api:auth/login',
    '/api:query/table_customers',
    '/api:v1/orders/checkout',
    '/api:functions/calculate_margin',
    '/api:webhooks/stripe_event',
    '/api:records/search_inventory'
  ];

  const handleFireSingle = (e: React.FormEvent) => {
    e.preventDefault();
    onSendSingle(endpoint, method, clientIp);
  };

  const handleFireBatch = () => {
    onSendBatch(endpoint, 50);
  };

  return (
    <div className="space-y-4">
      {/* Test Sandbox Control Box */}
      <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800/80">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            <span>{t.liveDispatcherTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.liveDispatcherDesc} Active balancer algorithm: <span className="text-emerald-400 font-mono">{algorithm}</span>
          </p>
        </div>

        <form onSubmit={handleFireSingle} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Method */}
          <div className="md:col-span-2">
            <label className="block text-slate-400 text-xs mb-1">{t.method}</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Endpoint */}
          <div className="md:col-span-5">
            <label className="block text-slate-400 text-xs mb-1">{t.endpoint}</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/api:query/table_customers"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <select
                onChange={(e) => { if (e.target.value) setEndpoint(e.target.value); }}
                value=""
                className="px-2 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-400"
                title="Select Preset"
              >
                <option value="" disabled>Presets</option>
                {presetEndpoints.map((ep) => (
                  <option key={ep} value={ep}>{ep}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Client IP */}
          <div className="md:col-span-2">
            <label className="block text-slate-400 text-xs mb-1">{t.clientIp}</label>
            <input
              type="text"
              value={clientIp}
              onChange={(e) => setClientIp(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded transition-colors whitespace-nowrap shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.sendSingle}</span>
            </button>

            <button
              type="button"
              onClick={handleFireBatch}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap"
              title="Dispatches 50 requests in rapid succession to observe cluster load distribution"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.sendBatch50}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dispatched Requests Live Stream Table */}
      <div className="bg-slate-900/80 rounded-lg border border-slate-800/80 overflow-hidden">
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              {t.dispatchedLogs}
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              ({dispatchedList.length} traces)
            </span>
          </div>

          {dispatchedList.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800/80">
              <tr>
                <th className="px-3.5 py-2 font-medium">{t.time}</th>
                <th className="px-3.5 py-2 font-medium">{t.method}</th>
                <th className="px-3.5 py-2 font-medium">{t.endpoint}</th>
                <th className="px-3.5 py-2 font-medium">{t.clientIp}</th>
                <th className="px-3.5 py-2 font-medium">{t.targetNode}</th>
                <th className="px-3.5 py-2 font-medium">{t.beamPid}</th>
                <th className="px-3.5 py-2 font-medium text-right">{t.latency}</th>
                <th className="px-3.5 py-2 font-medium text-right">{t.statusCode}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {dispatchedList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400 font-sans">
                    No requests dispatched yet. Use the controls above to send test requests or enable auto-running.
                  </td>
                </tr>
              ) : (
                dispatchedList.map((req) => {
                  const isSuccess = req.status >= 200 && req.status < 300;
                  const isError = req.status >= 500;
                  const isWarning = req.status === 429;

                  return (
                    <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3.5 py-2 text-slate-400 tabular-nums">
                        {req.timestamp}
                      </td>
                      <td className="px-3.5 py-2">
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                          req.method === 'GET' ? 'text-cyan-400 bg-cyan-950/40' :
                          req.method === 'POST' ? 'text-emerald-400 bg-emerald-950/40' :
                          req.method === 'PUT' ? 'text-amber-400 bg-amber-950/40' : 'text-rose-400 bg-rose-950/40'
                        }`}>
                          {req.method}
                        </span>
                      </td>
                      <td className="px-3.5 py-2 text-slate-300 font-sans truncate max-w-xs" title={req.endpoint}>
                        {req.endpoint}
                      </td>
                      <td className="px-3.5 py-2 text-slate-400 tabular-nums">
                        {req.clientIp}
                      </td>
                      <td className="px-3.5 py-2 font-sans font-medium text-emerald-400">
                        {req.targetNodeId.toUpperCase()}
                        <span className="text-[11px] text-slate-400 font-normal ml-1 hidden sm:inline">
                          ({req.targetNodeName.split(' ')[0]})
                        </span>
                      </td>
                      <td className="px-3.5 py-2 text-slate-400">
                        {req.beamWorkerPid}
                      </td>
                      <td className="px-3.5 py-2 text-right tabular-nums text-slate-200">
                        {req.latencyMs} ms
                      </td>
                      <td className="px-3.5 py-2 text-right">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          isSuccess ? 'text-emerald-400' : isWarning ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
