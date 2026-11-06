export type NodeStatus = 'healthy' | 'degraded' | 'draining' | 'offline' | 'maintenance';

export type BalancingAlgorithm = 
  | 'round_robin' 
  | 'least_conn' 
  | 'weighted_ewma' 
  | 'consistent_hash' 
  | 'resource_aware' 
  | 'adaptive_codel';

export type TrafficPattern = 'steady' | 'burst' | 'sinusoidal' | 'chaos';

export interface XanoServerNode {
  id: string; // e.g. "xano-01" to "xano-20"
  name: string;
  host: string;
  region: string;
  flag: string;
  status: NodeStatus;
  weight: number; // 1 to 10
  activeConnections: number;
  totalRequests: number;
  qps: number;
  latencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  cpuPercent: number;
  ramPercent: number;
  dbPoolCurrent: number;
  dbPoolMax: number;
  errorRate: number; // percentage, e.g. 0.05
  erlangPid: string; // e.g. "<0.142.0>"
  lastHealthCheck: string;
  chaosLagMs: number; // simulated latency injection
  tags: string[];
}

export interface ErlangClusterTelemetry {
  beamNode: string;
  otpVersion: string;
  totalRps: number;
  peakRps: number;
  totalRequestsHandled: number;
  activeBeamProcesses: number;
  schedulersOnline: number;
  schedulerCount: number;
  schedulerUtilization: number; // percent
  runQueueDepth: number;
  memoryAllocatedMb: number;
  etsTableCount: number;
  uptimeSeconds: number;
  circuitBreakersTripped: number;
}

export interface DispatchedRequest {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  clientIp: string;
  targetNodeId: string;
  targetNodeName: string;
  algorithm: BalancingAlgorithm;
  latencyMs: number;
  status: 200 | 201 | 400 | 429 | 500 | 502 | 504;
  beamWorkerPid: string;
}

export interface MetricsPoint {
  time: string;
  rps: number;
  p50: number;
  p95: number;
  p99: number;
  errorCount: number;
  runQueue: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'REBALANCE';
  category: 'ROUTER' | 'HEALTH' | 'BEAM' | 'FAILOVER' | 'POOL' | 'REBALANCE';
  message: string;
  details?: string;
}
