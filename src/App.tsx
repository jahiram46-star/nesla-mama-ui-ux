import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  XanoServerNode, 
  BalancingAlgorithm, 
  TrafficPattern, 
  ErlangClusterTelemetry, 
  DispatchedRequest, 
  MetricsPoint, 
  LogEntry 
} from './types/balancer';
import { 
  INITIAL_20_XANO_NODES, 
  INITIAL_TELEMETRY, 
  dispatchRequest, 
  generateMetricsPoint 
} from './utils/simulationEngine';
import { Language, translations } from './utils/i18n';
import { Header } from './components/Header';
import { ClusterKpis } from './components/ClusterKpis';
import { AlgorithmControls } from './components/AlgorithmControls';
import { NodesGrid } from './components/NodesGrid';
import { LiveRequestDispatcher } from './components/LiveRequestDispatcher';
import { ErlangBeamInspector } from './components/ErlangBeamInspector';
import { ClusterCharts } from './components/ClusterCharts';
import { LogsViewer } from './components/LogsViewer';
import { NodeDetailModal } from './components/NodeDetailModal';
import { ErlangConfigModal } from './components/ErlangConfigModal';

export default function App() {
  // Bilingual state - default to Bengali (bn) since user prompted in Bengali, easily toggled to English
  const [lang, setLang] = useState<Language>('bn');
  const t = translations[lang];

  // Core balancer states
  const [nodes, setNodes] = useState<XanoServerNode[]>(INITIAL_20_XANO_NODES);
  const [algorithm, setAlgorithm] = useState<BalancingAlgorithm>('least_conn');
  const [targetRps, setTargetRps] = useState<number>(850);
  const [pattern, setPattern] = useState<TrafficPattern>('steady');
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Runtime telemetry & logs
  const [telemetry, setTelemetry] = useState<ErlangClusterTelemetry>(INITIAL_TELEMETRY);
  const [dispatchedList, setDispatchedList] = useState<DispatchedRequest[]>([]);
  const [history, setHistory] = useState<MetricsPoint[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init_1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      category: 'BEAM',
      message: 'BEAM Erlang VM initialized with 16 SMP schedulers',
      details: 'ERTS 14.2.2 / OTP 26.2.2'
    },
    {
      id: 'init_2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      category: 'ROUTER',
      message: 'beam_lb_dispatcher started. 20 Xano backend servers registered',
      details: 'max_backends: 20'
    },
    {
      id: 'init_3',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      category: 'HEALTH',
      message: 'Health prober heartbeat active on 2500ms cycle across all 20 nodes'
    }
  ]);

  // UI view state
  const [activeTab, setActiveTab] = useState<string>('nodes');
  const [inspectingNode, setInspectingNode] = useState<XanoServerNode | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  // Tick ref to track sine wave phase
  const tickCountRef = useRef<number>(0);

  // Add Log Helper
  const addLog = useCallback((
    level: 'INFO' | 'WARN' | 'ERROR' | 'REBALANCE',
    category: 'ROUTER' | 'HEALTH' | 'BEAM' | 'FAILOVER' | 'POOL' | 'REBALANCE',
    message: string,
    details?: string
  ) => {
    const newEntry: LogEntry = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      category,
      message,
      details
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 199)]);
  }, []);

  // Main client-side simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tickCountRef.current += 1;
      const ticks = tickCountRef.current;

      // 1. Calculate effective RPS based on pattern
      let currentRps = targetRps;
      if (pattern === 'burst') {
        // Periodic spike every 8 ticks
        if (ticks % 8 === 0) currentRps = targetRps * 2.2;
      } else if (pattern === 'sinusoidal') {
        const factor = 1 + 0.35 * Math.sin(ticks * 0.2);
        currentRps = Math.round(targetRps * factor);
      } else if (pattern === 'chaos') {
        // Randomly degrade a node occasionally
        if (ticks % 10 === 0) {
          setNodes((prev) => {
            const healthy = prev.filter(n => n.status === 'healthy');
            if (healthy.length > 2) {
              const victim = healthy[Math.floor(Math.random() * healthy.length)];
              addLog('WARN', 'FAILOVER', `Simulated latency surge on ${victim.id.toUpperCase()}`, '+250ms chaos injected');
              return prev.map(n => n.id === victim.id ? { ...n, chaosLagMs: 250, status: 'degraded' } : n);
            }
            return prev;
          });
        }
      }

      // Add jitter to RPS
      const jitter = Math.floor((Math.random() - 0.5) * (currentRps * 0.08));
      const simulatedRps = Math.max(50, Math.round(currentRps + jitter));

      // 2. Dispatch a sample of simulated requests across nodes
      const sampleSize = Math.min(8, Math.max(2, Math.round(simulatedRps / 120)));
      const sampleDispatches: DispatchedRequest[] = [];

      setNodes((currentNodes) => {
        let tempNodes = [...currentNodes];

        for (let i = 0; i < sampleSize; i++) {
          const res = dispatchRequest(tempNodes, algorithm);
          if (res) {
            sampleDispatches.push(res.request);
            tempNodes = res.updatedNodes;
          }
        }

        // Apply natural load decay & connection closure per second
        return tempNodes.map((node) => {
          if (node.status === 'offline') {
            return {
              ...node,
              qps: 0,
              activeConnections: 0,
              cpuPercent: Math.max(5, node.cpuPercent - 5),
              dbPoolCurrent: Math.max(0, node.dbPoolCurrent - 3)
            };
          }

          // Compute proportional share of QPS
          const activeCount = tempNodes.filter(n => n.status !== 'offline').length || 1;
          const weightRatio = (node.weight || 1) / (tempNodes.reduce((acc, curr) => acc + (curr.status !== 'offline' ? curr.weight : 0), 0) || 1);
          
          let targetNodeQps = Math.round(simulatedRps * (algorithm === 'round_robin' ? (1 / activeCount) : weightRatio));
          if (node.status === 'draining') targetNodeQps = Math.max(0, Math.round(node.qps * 0.4));
          if (node.status === 'degraded') targetNodeQps = Math.max(5, Math.round(targetNodeQps * 0.6));

          // Jitter
          const qps = Math.max(0, targetNodeQps + Math.floor((Math.random() - 0.5) * 6));
          const activeConnections = Math.max(2, Math.min(120, Math.round(qps * 0.45 + (Math.random() * 4))));
          const cpu = Math.max(10, Math.min(94, Math.round(20 + (qps * 0.6) + (node.chaosLagMs > 0 ? 25 : 0))));
          const dbPool = Math.max(1, Math.min(node.dbPoolMax, Math.round((activeConnections * 0.6) + (Math.random() * 3))));

          // Latency jitter
          const baseLat = 14 + Math.round((cpu / 100) * 20);
          const p95 = baseLat + 12;
          const p99 = baseLat + 35;

          return {
            ...node,
            qps,
            activeConnections,
            cpuPercent: cpu,
            dbPoolCurrent: dbPool,
            latencyMs: baseLat,
            p95LatencyMs: p95,
            p99LatencyMs: p99,
            totalRequests: node.totalRequests + qps
          };
        });
      });

      // 3. Update dispatched traces list (keep last 40)
      if (sampleDispatches.length > 0) {
        setDispatchedList((prev) => [...sampleDispatches, ...prev].slice(0, 40));
      }

      // 4. Update BEAM telemetry
      setTelemetry((prev) => {
        const newTotalReqs = prev.totalRequestsHandled + simulatedRps;
        const newPeak = Math.max(prev.peakRps, simulatedRps);
        const schedUtil = Math.min(92, Math.max(18, Math.round(25 + (simulatedRps / 2500) * 60)));
        const procCount = 3800 + Math.round((simulatedRps / 10) + Math.random() * 50);
        const queueDepth = simulatedRps > 1800 ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 2);

        return {
          ...prev,
          totalRps: simulatedRps,
          peakRps: newPeak,
          totalRequestsHandled: newTotalReqs,
          schedulerUtilization: schedUtil,
          activeBeamProcesses: procCount,
          runQueueDepth: queueDepth,
          uptimeSeconds: prev.uptimeSeconds + 1
        };
      });

      // 5. Update rolling history for charts (30 points)
      setHistory((prev) => {
        const pt = generateMetricsPoint(nodes, simulatedRps, telemetry.runQueueDepth);
        const next = [...prev, pt];
        return next.length > 30 ? next.slice(next.length - 30) : next;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, targetRps, pattern, algorithm, nodes, telemetry.runQueueDepth, addLog]);

  // Initial seed of history points on mount
  useEffect(() => {
    const seed: MetricsPoint[] = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 1000);
      const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
      seed.push({
        time,
        rps: Math.round(800 + Math.sin(i * 0.3) * 120),
        p50: 16 + Math.floor(Math.random() * 4),
        p95: 28 + Math.floor(Math.random() * 6),
        p99: 55 + Math.floor(Math.random() * 12),
        errorCount: 0,
        runQueue: 1
      });
    }
    setHistory(seed);
  }, []);

  // Handlers for node toggles
  const handleDrainToggle = useCallback((id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const newStatus = n.status === 'draining' ? 'healthy' : 'draining';
        addLog(
          newStatus === 'draining' ? 'WARN' : 'INFO',
          'ROUTER',
          `${n.id.toUpperCase()} connection draining ${newStatus === 'draining' ? 'initiated' : 'restored'}`,
          `Host: ${n.host}`
        );
        return { ...n, status: newStatus };
      })
    );
  }, [addLog]);

  const handleStatusToggle = useCallback((id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const newStatus = n.status === 'offline' ? 'healthy' : 'offline';
        addLog(
          newStatus === 'offline' ? 'ERROR' : 'INFO',
          'FAILOVER',
          `${n.id.toUpperCase()} marked ${newStatus.toUpperCase()}`,
          `Erlang PID: ${n.erlangPid}`
        );
        return {
          ...n,
          status: newStatus,
          activeConnections: newStatus === 'offline' ? 0 : n.activeConnections,
          qps: newStatus === 'offline' ? 0 : 25
        };
      })
    );
  }, [addLog]);

  const handleLagToggle = useCallback((id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const newLag = n.chaosLagMs > 0 ? 0 : 200;
        addLog(
          newLag > 0 ? 'WARN' : 'INFO',
          'HEALTH',
          `${n.id.toUpperCase()} artificial lag ${newLag > 0 ? 'injected (+200ms)' : 'cleared'}`,
          `Algorithm: ${algorithm}`
        );
        return {
          ...n,
          chaosLagMs: newLag,
          status: newLag > 0 ? 'degraded' : 'healthy'
        };
      })
    );
  }, [algorithm, addLog]);

  // Chaos Trigger
  const handleChaosTrigger = useCallback(() => {
    setNodes((prev) => {
      const healthy = prev.filter(n => n.status === 'healthy');
      if (healthy.length === 0) return prev;
      const target = healthy[Math.floor(Math.random() * healthy.length)];
      addLog('ERROR', 'FAILOVER', `Simulated instant failure on ${target.id.toUpperCase()}`, 'Erlang supervisor rerouting active calls');
      return prev.map(n => n.id === target.id ? { ...n, status: 'offline', activeConnections: 0, qps: 0 } : n);
    });
  }, [addLog]);

  // Heal All Nodes
  const handleRestoreAll = useCallback(() => {
    setNodes((prev) =>
      prev.map(n => ({
        ...n,
        status: 'healthy',
        chaosLagMs: 0
      }))
    );
    addLog('INFO', 'REBALANCE', 'All 20 Xano backend servers restored to nominal healthy status');
  }, [addLog]);

  // Reset entire cluster
  const handleResetCluster = useCallback(() => {
    setNodes(INITIAL_20_XANO_NODES);
    setTelemetry(INITIAL_TELEMETRY);
    setDispatchedList([]);
    addLog('INFO', 'BEAM', 'Cluster state reset to default configuration');
  }, [addLog]);

  // Single test request
  const handleSendSingle = useCallback((
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    ip: string
  ) => {
    const res = dispatchRequest(nodes, algorithm, endpoint, method, ip);
    if (res) {
      setDispatchedList((prev) => [res.request, ...prev].slice(0, 40));
      setNodes(res.updatedNodes);
      addLog(
        'INFO',
        'ROUTER',
        `Dispatched ${method} ${endpoint} -> ${res.request.targetNodeId.toUpperCase()}`,
        `${res.request.latencyMs}ms · status ${res.request.status}`
      );
    }
  }, [nodes, algorithm, addLog]);

  // Batch 50 test requests
  const handleSendBatch = useCallback((endpoint: string, count: number) => {
    let tempNodes = [...nodes];
    const newTraces: DispatchedRequest[] = [];
    for (let i = 0; i < count; i++) {
      const res = dispatchRequest(tempNodes, algorithm, endpoint);
      if (res) {
        newTraces.push(res.request);
        tempNodes = res.updatedNodes;
      }
    }
    setNodes(tempNodes);
    setDispatchedList((prev) => [...newTraces, ...prev].slice(0, 40));
    addLog('INFO', 'ROUTER', `Dispatched batch burst of ${count} requests across 20 nodes`, `Algorithm: ${algorithm}`);
  }, [nodes, algorithm, addLog]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={() => setLang(lang === 'bn' ? 'en' : 'bn')}
        isRunning={isRunning}
        onToggleRunning={() => setIsRunning(!isRunning)}
        onReset={handleResetCluster}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI strip */}
        <ClusterKpis nodes={nodes} telemetry={telemetry} lang={lang} />

        {/* Algorithm & Traffic Controls */}
        <AlgorithmControls
          algorithm={algorithm}
          onChangeAlgorithm={(algo) => {
            setAlgorithm(algo);
            addLog('REBALANCE', 'ROUTER', `Active balancing algorithm switched to ${algo.toUpperCase()}`);
          }}
          targetRps={targetRps}
          onChangeRps={setTargetRps}
          pattern={pattern}
          onChangePattern={(p) => {
            setPattern(p);
            addLog('INFO', 'ROUTER', `Traffic generator pattern changed to ${p.toUpperCase()}`);
          }}
          onChaosTrigger={handleChaosTrigger}
          onRestoreAll={handleRestoreAll}
          lang={lang}
        />

        {/* Primary Tabbed Views */}
        {activeTab === 'nodes' && (
          <NodesGrid
            nodes={nodes}
            onDrainToggle={handleDrainToggle}
            onStatusToggle={handleStatusToggle}
            onLagToggle={handleLagToggle}
            onInspect={(node) => setInspectingNode(node)}
            lang={lang}
          />
        )}

        {activeTab === 'dispatcher' && (
          <LiveRequestDispatcher
            dispatchedList={dispatchedList}
            onSendSingle={handleSendSingle}
            onSendBatch={handleSendBatch}
            onClear={() => setDispatchedList([])}
            algorithm={algorithm}
            nodes={nodes}
            lang={lang}
          />
        )}

        {activeTab === 'metrics' && (
          <ClusterCharts
            history={history}
            nodes={nodes}
            lang={lang}
          />
        )}

        {activeTab === 'beam' && (
          <ErlangBeamInspector
            telemetry={telemetry}
            nodes={nodes}
            lang={lang}
          />
        )}

        {activeTab === 'logs' && (
          <LogsViewer
            logs={logs}
            onClear={() => setLogs([])}
            lang={lang}
          />
        )}
      </main>

      {/* Node Details Inspection Modal */}
      <NodeDetailModal
        node={inspectingNode}
        onClose={() => setInspectingNode(null)}
        onUpdateNode={(updated) => {
          setNodes((prev) => prev.map(n => n.id === updated.id ? updated : n));
          addLog('INFO', 'ROUTER', `Configuration updated for ${updated.id.toUpperCase()}`, `Weight: ${updated.weight}x · Status: ${updated.status}`);
        }}
        lang={lang}
      />

      {/* Erlang Production Config Export Modal */}
      <ErlangConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        nodes={nodes}
        algorithm={algorithm}
        lang={lang}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            BeamLoad Erlang Cluster Controller · Orchestrating 20 Xano Backend Instances
          </div>
          <div className="flex items-center gap-4">
            <span>Erlang/OTP 26+</span>
            <span aria-hidden="true">·</span>
            <span>ERTS 14.2.2</span>
            <span aria-hidden="true">·</span>
            <span>Client-Side Telemetry Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
