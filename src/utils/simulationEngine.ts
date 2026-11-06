import { 
  XanoServerNode, 
  BalancingAlgorithm, 
  TrafficPattern, 
  ErlangClusterTelemetry, 
  DispatchedRequest, 
  MetricsPoint, 
  LogEntry 
} from '../types/balancer';

export const INITIAL_20_XANO_NODES: XanoServerNode[] = [
  {
    id: 'xano-01',
    name: 'Xano Core API-1 (Auth & Session)',
    host: 'api-us-east-01.xano.io',
    region: 'us-east-1',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 10,
    activeConnections: 24,
    totalRequests: 142800,
    qps: 68,
    latencyMs: 14,
    p95LatencyMs: 24,
    p99LatencyMs: 48,
    cpuPercent: 32,
    ramPercent: 44,
    dbPoolCurrent: 18,
    dbPoolMax: 60,
    errorRate: 0.02,
    erlangPid: '<0.1401.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['auth', 'core', 'postgres']
  },
  {
    id: 'xano-02',
    name: 'Xano Core API-2 (Auth & Session)',
    host: 'api-us-east-02.xano.io',
    region: 'us-east-1',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 10,
    activeConnections: 26,
    totalRequests: 139400,
    qps: 65,
    latencyMs: 15,
    p95LatencyMs: 26,
    p99LatencyMs: 51,
    cpuPercent: 34,
    ramPercent: 46,
    dbPoolCurrent: 20,
    dbPoolMax: 60,
    errorRate: 0.03,
    erlangPid: '<0.1402.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['auth', 'core', 'postgres']
  },
  {
    id: 'xano-03',
    name: 'Xano Data API-1 (Query Engine)',
    host: 'query-us-east-03.xano.io',
    region: 'us-east-1',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 9,
    activeConnections: 35,
    totalRequests: 184500,
    qps: 78,
    latencyMs: 19,
    p95LatencyMs: 34,
    p99LatencyMs: 65,
    cpuPercent: 48,
    ramPercent: 55,
    dbPoolCurrent: 38,
    dbPoolMax: 75,
    errorRate: 0.04,
    erlangPid: '<0.1403.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['database', 'orm', 'records']
  },
  {
    id: 'xano-04',
    name: 'Xano Data API-2 (Query Engine)',
    host: 'query-us-east-04.xano.io',
    region: 'us-east-1',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 9,
    activeConnections: 31,
    totalRequests: 179200,
    qps: 74,
    latencyMs: 18,
    p95LatencyMs: 31,
    p99LatencyMs: 62,
    cpuPercent: 44,
    ramPercent: 52,
    dbPoolCurrent: 34,
    dbPoolMax: 75,
    errorRate: 0.02,
    erlangPid: '<0.1404.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['database', 'orm', 'records']
  },
  {
    id: 'xano-05',
    name: 'Xano Functions Worker-1 (Lambda)',
    host: 'fn-us-west-05.xano.io',
    region: 'us-west-2',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 8,
    activeConnections: 18,
    totalRequests: 95400,
    qps: 52,
    latencyMs: 28,
    p95LatencyMs: 44,
    p99LatencyMs: 82,
    cpuPercent: 41,
    ramPercent: 38,
    dbPoolCurrent: 14,
    dbPoolMax: 50,
    errorRate: 0.05,
    erlangPid: '<0.1405.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['custom-js', 'microservice']
  },
  {
    id: 'xano-06',
    name: 'Xano Functions Worker-2 (Lambda)',
    host: 'fn-us-west-06.xano.io',
    region: 'us-west-2',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 8,
    activeConnections: 21,
    totalRequests: 92100,
    qps: 50,
    latencyMs: 30,
    p95LatencyMs: 48,
    p99LatencyMs: 89,
    cpuPercent: 45,
    ramPercent: 42,
    dbPoolCurrent: 16,
    dbPoolMax: 50,
    errorRate: 0.06,
    erlangPid: '<0.1406.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['custom-js', 'microservice']
  },
  {
    id: 'xano-07',
    name: 'Xano Webhook Ingestion-1',
    host: 'hook-eu-west-07.xano.io',
    region: 'eu-west-1',
    flag: '🇮🇪',
    status: 'healthy',
    weight: 7,
    activeConnections: 15,
    totalRequests: 86300,
    qps: 42,
    latencyMs: 22,
    p95LatencyMs: 36,
    p99LatencyMs: 70,
    cpuPercent: 29,
    ramPercent: 35,
    dbPoolCurrent: 11,
    dbPoolMax: 40,
    errorRate: 0.01,
    erlangPid: '<0.1407.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['webhooks', 'event-queue']
  },
  {
    id: 'xano-08',
    name: 'Xano Webhook Ingestion-2',
    host: 'hook-eu-west-08.xano.io',
    region: 'eu-west-1',
    flag: '🇮🇪',
    status: 'healthy',
    weight: 7,
    activeConnections: 14,
    totalRequests: 84900,
    qps: 40,
    latencyMs: 23,
    p95LatencyMs: 38,
    p99LatencyMs: 72,
    cpuPercent: 28,
    ramPercent: 34,
    dbPoolCurrent: 10,
    dbPoolMax: 40,
    errorRate: 0.01,
    erlangPid: '<0.1408.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['webhooks', 'event-queue']
  },
  {
    id: 'xano-09',
    name: 'Xano Europe API-1 (General)',
    host: 'api-eu-central-09.xano.io',
    region: 'eu-central-1',
    flag: '🇩🇪',
    status: 'healthy',
    weight: 8,
    activeConnections: 29,
    totalRequests: 122000,
    qps: 62,
    latencyMs: 21,
    p95LatencyMs: 35,
    p99LatencyMs: 68,
    cpuPercent: 38,
    ramPercent: 49,
    dbPoolCurrent: 25,
    dbPoolMax: 60,
    errorRate: 0.02,
    erlangPid: '<0.1409.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['api', 'eu-gdpr', 'postgres']
  },
  {
    id: 'xano-10',
    name: 'Xano Europe API-2 (General)',
    host: 'api-eu-central-10.xano.io',
    region: 'eu-central-1',
    flag: '🇩🇪',
    status: 'healthy',
    weight: 8,
    activeConnections: 27,
    totalRequests: 118400,
    qps: 59,
    latencyMs: 22,
    p95LatencyMs: 37,
    p99LatencyMs: 71,
    cpuPercent: 37,
    ramPercent: 47,
    dbPoolCurrent: 23,
    dbPoolMax: 60,
    errorRate: 0.03,
    erlangPid: '<0.1410.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['api', 'eu-gdpr', 'postgres']
  },
  {
    id: 'xano-11',
    name: 'Xano Asia-Pacific API-1',
    host: 'api-ap-se-11.xano.io',
    region: 'ap-southeast-1',
    flag: '🇸🇬',
    status: 'healthy',
    weight: 7,
    activeConnections: 22,
    totalRequests: 76000,
    qps: 45,
    latencyMs: 38,
    p95LatencyMs: 56,
    p99LatencyMs: 95,
    cpuPercent: 33,
    ramPercent: 41,
    dbPoolCurrent: 17,
    dbPoolMax: 50,
    errorRate: 0.04,
    erlangPid: '<0.1411.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['apac', 'api', 'postgres']
  },
  {
    id: 'xano-12',
    name: 'Xano Asia-Pacific API-2',
    host: 'api-ap-se-12.xano.io',
    region: 'ap-southeast-1',
    flag: '🇸🇬',
    status: 'healthy',
    weight: 7,
    activeConnections: 19,
    totalRequests: 73500,
    qps: 43,
    latencyMs: 39,
    p95LatencyMs: 58,
    p99LatencyMs: 98,
    cpuPercent: 31,
    ramPercent: 40,
    dbPoolCurrent: 15,
    dbPoolMax: 50,
    errorRate: 0.04,
    erlangPid: '<0.1412.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['apac', 'api', 'postgres']
  },
  {
    id: 'xano-13',
    name: 'Xano India / South Asia Gateway',
    host: 'api-ap-south-13.xano.io',
    region: 'ap-south-1',
    flag: '🇮🇳',
    status: 'healthy',
    weight: 8,
    activeConnections: 28,
    totalRequests: 98400,
    qps: 58,
    latencyMs: 34,
    p95LatencyMs: 52,
    p99LatencyMs: 92,
    cpuPercent: 42,
    ramPercent: 45,
    dbPoolCurrent: 24,
    dbPoolMax: 60,
    errorRate: 0.03,
    erlangPid: '<0.1413.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['south-asia', 'api', 'gateway']
  },
  {
    id: 'xano-14',
    name: 'Xano File & Media Processing',
    host: 'media-us-east-14.xano.io',
    region: 'us-east-1',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 6,
    activeConnections: 12,
    totalRequests: 41200,
    qps: 28,
    latencyMs: 45,
    p95LatencyMs: 75,
    p99LatencyMs: 130,
    cpuPercent: 52,
    ramPercent: 68,
    dbPoolCurrent: 9,
    dbPoolMax: 30,
    errorRate: 0.05,
    erlangPid: '<0.1414.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['uploads', 's3-proxy', 'resizing']
  },
  {
    id: 'xano-15',
    name: 'Xano Realtime Channels / SSE',
    host: 'realtime-us-east-15.xano.io',
    region: 'us-east-1',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 9,
    activeConnections: 64,
    totalRequests: 165000,
    qps: 82,
    latencyMs: 12,
    p95LatencyMs: 20,
    p99LatencyMs: 39,
    cpuPercent: 36,
    ramPercent: 50,
    dbPoolCurrent: 20,
    dbPoolMax: 80,
    errorRate: 0.01,
    erlangPid: '<0.1415.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['sse', 'live-updates', 'websockets']
  },
  {
    id: 'xano-16',
    name: 'Xano Aggregates & Analytics-1',
    host: 'analytics-eu-16.xano.io',
    region: 'eu-central-1',
    flag: '🇩🇪',
    status: 'healthy',
    weight: 6,
    activeConnections: 16,
    totalRequests: 54100,
    qps: 32,
    latencyMs: 38,
    p95LatencyMs: 62,
    p99LatencyMs: 110,
    cpuPercent: 58,
    ramPercent: 62,
    dbPoolCurrent: 18,
    dbPoolMax: 40,
    errorRate: 0.08,
    erlangPid: '<0.1416.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['olap', 'group-by', 'reports']
  },
  {
    id: 'xano-17',
    name: 'Xano Middle East API',
    host: 'api-me-central-17.xano.io',
    region: 'me-central-1',
    flag: '🇦🇪',
    status: 'healthy',
    weight: 6,
    activeConnections: 11,
    totalRequests: 32400,
    qps: 22,
    latencyMs: 42,
    p95LatencyMs: 68,
    p99LatencyMs: 115,
    cpuPercent: 24,
    ramPercent: 32,
    dbPoolCurrent: 8,
    dbPoolMax: 40,
    errorRate: 0.02,
    erlangPid: '<0.1417.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['mena', 'api', 'postgres']
  },
  {
    id: 'xano-18',
    name: 'Xano South America API',
    host: 'api-sa-east-18.xano.io',
    region: 'sa-east-1',
    flag: '🇧🇷',
    status: 'healthy',
    weight: 6,
    activeConnections: 13,
    totalRequests: 36700,
    qps: 24,
    latencyMs: 51,
    p95LatencyMs: 82,
    p99LatencyMs: 142,
    cpuPercent: 26,
    ramPercent: 36,
    dbPoolCurrent: 10,
    dbPoolMax: 40,
    errorRate: 0.03,
    erlangPid: '<0.1418.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['latam', 'api', 'postgres']
  },
  {
    id: 'xano-19',
    name: 'Xano Batch Worker (Cron & Jobs)',
    host: 'batch-us-east-19.xano.io',
    region: 'us-east-1',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 7,
    activeConnections: 17,
    totalRequests: 62000,
    qps: 36,
    latencyMs: 32,
    p95LatencyMs: 55,
    p99LatencyMs: 98,
    cpuPercent: 49,
    ramPercent: 58,
    dbPoolCurrent: 16,
    dbPoolMax: 50,
    errorRate: 0.05,
    erlangPid: '<0.1419.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['cron', 'background-tasks']
  },
  {
    id: 'xano-20',
    name: 'Xano Failover Hot-Spare (Standby)',
    host: 'spare-us-east-20.xano.io',
    region: 'us-east-1',
    flag: '🇺🇸',
    status: 'healthy',
    weight: 10,
    activeConnections: 6,
    totalRequests: 18200,
    qps: 15,
    latencyMs: 13,
    p95LatencyMs: 22,
    p99LatencyMs: 41,
    cpuPercent: 12,
    ramPercent: 26,
    dbPoolCurrent: 4,
    dbPoolMax: 70,
    errorRate: 0.01,
    erlangPid: '<0.1420.0>',
    lastHealthCheck: 'Just now',
    chaosLagMs: 0,
    tags: ['hot-spare', 'failover', 'standby']
  }
];

export const INITIAL_TELEMETRY: ErlangClusterTelemetry = {
  beamNode: 'beam_lb@node-edge-01.internal',
  otpVersion: 'Erlang/OTP 26.2.2 [erts-14.2.2] [smp:16:16]',
  totalRps: 986,
  peakRps: 1640,
  totalRequestsHandled: 1654300,
  activeBeamProcesses: 4218,
  schedulersOnline: 16,
  schedulerCount: 16,
  schedulerUtilization: 41.2,
  runQueueDepth: 1,
  memoryAllocatedMb: 148.6,
  etsTableCount: 42,
  uptimeSeconds: 78420,
  circuitBreakersTripped: 0
};

// Simple consistent hash implementation
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
}

// Erlang load balancing selector implementation
let roundRobinIndex = 0;

export function selectBackendNode(
  nodes: XanoServerNode[],
  algorithm: BalancingAlgorithm,
  clientKey: string = '192.168.1.1'
): XanoServerNode | null {
  // Only route to non-offline nodes
  const available = nodes.filter(n => n.status !== 'offline');
  if (available.length === 0) return null;

  // Filter out draining nodes if there are other healthy ones
  const activeCandidates = available.filter(n => n.status !== 'draining');
  const pool = activeCandidates.length > 0 ? activeCandidates : available;

  switch (algorithm) {
    case 'round_robin': {
      roundRobinIndex = (roundRobinIndex + 1) % pool.length;
      return pool[roundRobinIndex];
    }
    case 'least_conn': {
      // Find node with fewest active connections normalized by weight
      let best = pool[0];
      let minLoad = best.activeConnections / (best.weight || 1);
      for (let i = 1; i < pool.length; i++) {
        const load = pool[i].activeConnections / (pool[i].weight || 1);
        if (load < minLoad) {
          minLoad = load;
          best = pool[i];
        }
      }
      return best;
    }
    case 'weighted_ewma': {
      // Peak EWMA: score = (latency + injected lag) / weight
      let best = pool[0];
      let bestScore = (best.latencyMs + best.chaosLagMs) / (best.weight || 1);
      for (let i = 1; i < pool.length; i++) {
        const score = (pool[i].latencyMs + pool[i].chaosLagMs) / (pool[i].weight || 1);
        if (score < bestScore) {
          bestScore = score;
          best = pool[i];
        }
      }
      return best;
    }
    case 'consistent_hash': {
      // Consistent hash of client IP / token across active nodes
      const hash = hashString(clientKey);
      const index = hash % pool.length;
      return pool[index];
    }
    case 'resource_aware': {
      // Avoid high CPU & saturated Postgres DB pools
      let best = pool[0];
      let bestHealthScore = 0;
      for (const n of pool) {
        const cpuPenalty = n.cpuPercent > 80 ? 50 : n.cpuPercent * 0.4;
        const dbPoolPenalty = (n.dbPoolCurrent / n.dbPoolMax) * 40;
        const latencyPenalty = (n.latencyMs + n.chaosLagMs) * 0.5;
        const penalty = cpuPenalty + dbPoolPenalty + latencyPenalty;
        const score = 100 - penalty + (n.weight * 2);
        if (score > bestHealthScore) {
          bestHealthScore = score;
          best = n;
        }
      }
      return best;
    }
    case 'adaptive_codel': {
      // Controlled Delay - shed nodes with latency spikes
      const valid = pool.filter(n => (n.latencyMs + n.chaosLagMs) < 150);
      const subpool = valid.length > 0 ? valid : pool;
      // pick least loaded among compliant
      return subpool.reduce((prev, curr) => 
        (curr.activeConnections < prev.activeConnections ? curr : prev)
      );
    }
    default:
      return pool[0];
  }
}

// Generate an individual simulated request dispatch
export function dispatchRequest(
  nodes: XanoServerNode[],
  algorithm: BalancingAlgorithm,
  customEndpoint?: string,
  customMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  customIp?: string
): { request: DispatchedRequest; updatedNodes: XanoServerNode[] } | null {
  const endpoints = [
    '/api:auth/login',
    '/api:query/table_customers',
    '/api:v1/orders/checkout',
    '/api:functions/calculate_margin',
    '/api:webhooks/stripe_event',
    '/api:records/search_inventory',
    '/api:sse/live_feed'
  ];
  const methods: ('GET' | 'POST' | 'PUT' | 'DELETE')[] = ['GET', 'GET', 'POST', 'POST', 'GET', 'DELETE'];
  
  const endpoint = customEndpoint || endpoints[Math.floor(Math.random() * endpoints.length)];
  const method = customMethod || methods[Math.floor(Math.random() * methods.length)];
  const clientIp = customIp || `192.168.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;

  const target = selectBackendNode(nodes, algorithm, clientIp);
  if (!target) return null;

  // Calculate actual response latency
  const baseLatency = target.latencyMs + target.chaosLagMs;
  const jitter = Math.floor((Math.random() - 0.5) * 8);
  const latency = Math.max(6, baseLatency + jitter);

  // Status code: 502/504 if degraded/chaosLag, 200/201 nominal
  let status: 200 | 201 | 400 | 429 | 500 | 502 | 504 = method === 'POST' ? 201 : 200;
  if (target.status === 'degraded' && Math.random() < 0.18) {
    status = 504;
  } else if (target.chaosLagMs > 300 && Math.random() < 0.25) {
    status = 502;
  } else if (target.dbPoolCurrent >= target.dbPoolMax && Math.random() < 0.3) {
    status = 429;
  }

  const workerPid = `<0.${Math.floor(Math.random() * 800) + 2000}.0>`;
  const reqId = 'req_' + Math.random().toString(36).substring(2, 9);
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

  const dispatched: DispatchedRequest = {
    id: reqId,
    timestamp: timeStr,
    method,
    endpoint,
    clientIp,
    targetNodeId: target.id,
    targetNodeName: target.name,
    algorithm,
    latencyMs: latency,
    status,
    beamWorkerPid: workerPid
  };

  // Update target node stats
  const updatedNodes = nodes.map(n => {
    if (n.id !== target.id) return n;
    return {
      ...n,
      activeConnections: Math.min(n.activeConnections + 1, 120),
      totalRequests: n.totalRequests + 1,
      qps: Math.round(n.qps + 1)
    };
  });

  return { request: dispatched, updatedNodes };
}

// Generate rolling metrics point
export function generateMetricsPoint(
  nodes: XanoServerNode[],
  currentRps: number,
  runQueue: number
): MetricsPoint {
  const activeNodes = nodes.filter(n => n.status !== 'offline');
  const latencies = activeNodes.map(n => n.latencyMs + n.chaosLagMs).sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 18;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 36;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 65;
  const errorCount = activeNodes.reduce((acc, n) => acc + (n.status === 'degraded' ? 3 : 0), 0);

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return {
    time,
    rps: currentRps,
    p50: Math.round(p50),
    p95: Math.round(p95),
    p99: Math.round(p99),
    errorCount,
    runQueue
  };
}
