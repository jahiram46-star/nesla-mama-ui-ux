export type Language = 'bn' | 'en';

export const translations = {
  bn: {
    appTitle: 'BeamLoad',
    appSubtitle: 'এরলাং লোড ব্যালেন্সার মনিটর (২০x Xano ক্লাস্টার)',
    running: 'চলমান',
    paused: 'স্থগিত',
    pauseSimulation: 'সিমুলেশন থামান',
    resumeSimulation: 'সিমুলেশন চালান',
    resetCluster: 'রিসেট ক্লাস্টার',
    erlangConfig: 'Erlang কনফিগ দেখুন',
    language: 'English',
    themeDark: 'ডার্ক মোড',
    themeLight: 'লাইট মোড',

    // KPIs
    healthyNodes: 'সক্রিয় নোড',
    totalCapacity: 'মোট ক্যাপাসিটি',
    clusterThroughput: 'ক্লাস্টার থ্রুপুট',
    clusterLatencyP95: 'P95 লেটেন্সি',
    beamProcesses: 'BEAM প্রসেসসমূহ',
    totalRequests: 'মোট রিকোয়েস্ট',
    schedulers: 'Erlang শিডিউলার',
    runQueue: 'রান কিউ ডেপথ',
    memoryUsage: 'মেমরি ব্যবহার',

    // Algorithm bar
    balancingAlgorithm: 'লোড ব্যালেন্সিং অ্যালগরিদম',
    algoRoundRobin: 'রাউন্ড রবিন (Round Robin)',
    algoLeastConn: 'ন্যূনতম কানেকশন (Least Conn)',
    algoWeightedEWMA: 'ওয়েটেড EWMA (Peak EWMA)',
    algoConsistentHash: 'কনসিস্টেন্ট হ্যাশিং (Consistent Hash)',
    algoResourceAware: 'রিসোর্স অ্যাওয়্যার (CPU / DB Pool)',
    algoAdaptiveCoDel: 'অ্যাডাপ্টিভ কোডেল (Adaptive CoDel)',

    trafficControl: 'ট্রাফিক রেট ও প্যাটার্ন',
    targetRps: 'টার্গেট RPS',
    pattern: 'প্যাটার্ন',
    patternSteady: 'স্থির (Steady)',
    patternBurst: 'হঠাৎ স্পাইক (Burst)',
    patternSinusoidal: 'দৈনিক সাইন ওয়েভ (Sinusoidal)',
    patternChaos: 'কেওস টেস্ট (Chaos Failover)',

    // Navigation Tabs
    tabNodes: '২০টি Xano সার্ভার নোড',
    tabDispatcher: 'লাইভ রিকোয়েস্ট টেস্ট ও স্ট্রিম',
    tabMetrics: 'রিয়েলটাইম পারফরম্যান্স চার্ট',
    tabBeam: 'এরলাং BEAM ইন্টারনালস',
    tabLogs: 'ইভেন্ট লগ ও অডিট',

    // Node grid & controls
    filterAll: 'সকল নোড (২০টি)',
    filterHealthy: 'সুস্থ',
    filterDegraded: 'ধীরগতির',
    filterDraining: 'ড্রেইনিং',
    filterOffline: 'অফলাইন',
    searchPlaceholder: 'নোডের নাম, হোস্ট বা ট্যাগ দিয়ে খুঁজুন...',
    nodeMaxNotice: 'সর্বোচ্চ ২০টি Xano সার্ভার আর্কিটেকচার সক্রিয়',

    // Node card
    connections: 'কানেকশন',
    weight: 'ওজন',
    dbPool: 'Postgres পুল',
    qps: 'QPS',
    latency: 'লেটেন্সি',
    cpu: 'CPU',
    ram: 'RAM',
    drain: 'ড্রেইন',
    undrain: 'রিস্টোর',
    kill: 'অফলাইন করুন',
    revive: 'অনলাইন করুন',
    injectLag: 'ল্যাগ ইনজেক্ট',
    clearLag: 'ল্যাগ সরান',
    viewDetails: 'বিস্তারিত দেখুন',

    // Live Dispatcher
    liveDispatcherTitle: 'লাইভ রিকোয়েস্ট ডিসপ্যাচার টেস্ট',
    liveDispatcherDesc: 'এরলাং রাউটার কীভাবে ২০টি Xano ব্যাকএন্ডে ট্রাফিক বণ্টন করে তা রিয়েল-টাইমে পরীক্ষা করুন।',
    endpoint: 'API এন্ডপয়েন্ট',
    clientIp: 'ক্লায়েন্ট আইপি',
    sendSingle: '১টি রিকোয়েস্ট পাঠান',
    sendBatch50: '৫০টি রিকোয়েস্টের ব্যাচ পাঠান',
    targetNode: 'নির্বাচিত নোড',
    statusCode: 'স্ট্যাটাস কোড',
    beamPid: 'BEAM কর্মী PID',
    time: 'সময়',
    method: 'মেথড',
    dispatchedLogs: 'সর্বশেষ ডিসপ্যাচ ইতিহাস',

    // Erlang BEAM Inspector
    beamTitle: 'Erlang / OTP সুপারভাইজার ট্রি ও ভার্চুয়াল মেশিন',
    beamDesc: 'Erlang এর লাইটওয়েট অ্যাক্টর মডেল প্রতিটি Xano ব্যাকএন্ডের জন্য নিজস্ব আইসোলেটেড প্রসেস পরিচালনা করে।',
    supervisorTree: 'সুপারভাইজার আর্কিটেকচার',
    schedulerUtilization: 'শিডিউলার ইউটিলাইজেশন',
    etsTables: 'লকলেস ETS টেবিল',
    gcMetrics: 'সাব-মিলিমেকেন্ড GC পজ',
    circuitBreakers: 'সার্কিট ব্রেকার',

    // Node Details Modal
    nodeDetailsTitle: 'নোড কনফিগারেশন ও রিয়েলটাইম টেলিমেট্রি',
    adjustWeight: 'নোড ট্রাফিক ওয়েট পরিবর্তন (১ - ১০)',
    close: 'বন্ধ করুন',
    saveChanges: 'সংরক্ষণ করুন',

    // Config export
    copyConfig: 'Erlang sys.config কপি করুন',
    copied: 'কপি করা হয়েছে!',
    rebarConfigTitle: 'Erlang/OTP প্রোডাকশন কনফিগারেশন'
  },
  en: {
    appTitle: 'BeamLoad',
    appSubtitle: 'Erlang Load Balancer Monitor (20x Xano Cluster)',
    running: 'Running',
    paused: 'Paused',
    pauseSimulation: 'Pause Engine',
    resumeSimulation: 'Resume Engine',
    resetCluster: 'Reset Cluster',
    erlangConfig: 'View Erlang Config',
    language: 'বাংলা',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',

    // KPIs
    healthyNodes: 'Healthy Nodes',
    totalCapacity: 'Total Capacity',
    clusterThroughput: 'Cluster Throughput',
    clusterLatencyP95: 'P95 Latency',
    beamProcesses: 'BEAM Processes',
    totalRequests: 'Total Requests',
    schedulers: 'Erlang Schedulers',
    runQueue: 'Run Queue Depth',
    memoryUsage: 'Memory Usage',

    // Algorithm bar
    balancingAlgorithm: 'Load Balancing Algorithm',
    algoRoundRobin: 'Round Robin',
    algoLeastConn: 'Least Connections',
    algoWeightedEWMA: 'Weighted EWMA (Peak EWMA)',
    algoConsistentHash: 'Consistent Hash',
    algoResourceAware: 'Resource Aware (CPU / DB Pool)',
    algoAdaptiveCoDel: 'Adaptive CoDel',

    trafficControl: 'Traffic Load & Pattern',
    targetRps: 'Target RPS',
    pattern: 'Pattern',
    patternSteady: 'Steady',
    patternBurst: 'Burst Spikes',
    patternSinusoidal: 'Sinusoidal (Day/Night)',
    patternChaos: 'Chaos Failover',

    // Navigation Tabs
    tabNodes: '20 Xano Backend Nodes',
    tabDispatcher: 'Live Request Sandbox & Stream',
    tabMetrics: 'Performance Metrics & Charts',
    tabBeam: 'Erlang BEAM Internals',
    tabLogs: 'Event Log & Audit',

    // Node grid & controls
    filterAll: 'All Nodes (20)',
    filterHealthy: 'Healthy',
    filterDegraded: 'Degraded',
    filterDraining: 'Draining',
    filterOffline: 'Offline',
    searchPlaceholder: 'Search by node ID, host or tag...',
    nodeMaxNotice: 'Managing 20 maximum Xano backend instances',

    // Node card
    connections: 'In-Flight Conn',
    weight: 'Weight',
    dbPool: 'Postgres Pool',
    qps: 'QPS',
    latency: 'Latency',
    cpu: 'CPU',
    ram: 'RAM',
    drain: 'Drain',
    undrain: 'Restore',
    kill: 'Take Offline',
    revive: 'Bring Online',
    injectLag: '+200ms Lag',
    clearLag: 'Reset Lag',
    viewDetails: 'Inspect Node',

    // Live Dispatcher
    liveDispatcherTitle: 'Live Request Sandbox & Route Trace',
    liveDispatcherDesc: 'Verify Erlang dispatcher route decisions across the 20 Xano backend workers in real-time.',
    endpoint: 'API Endpoint',
    clientIp: 'Client IP',
    sendSingle: 'Send 1 Request',
    sendBatch50: 'Fire 50 Request Burst',
    targetNode: 'Dispatched Node',
    statusCode: 'HTTP Status',
    beamPid: 'Worker PID',
    time: 'Time',
    method: 'Method',
    dispatchedLogs: 'Recent Dispatches',

    // Erlang BEAM Inspector
    beamTitle: 'Erlang / OTP Supervision Tree & Runtime',
    beamDesc: 'Erlang lightweight actor processes isolate each Xano node connection pool with zero lock contention.',
    supervisorTree: 'Supervision Hierarchy',
    schedulerUtilization: 'Scheduler Utilization',
    etsTables: 'Lockless ETS Tables',
    gcMetrics: 'Sub-millisecond GC Pauses',
    circuitBreakers: 'Circuit Breakers',

    // Node Details Modal
    nodeDetailsTitle: 'Node Configuration & Telemetry',
    adjustWeight: 'Adjust Traffic Weight (1 - 10)',
    close: 'Close',
    saveChanges: 'Save Changes',

    // Config export
    copyConfig: 'Copy Erlang sys.config',
    copied: 'Copied!',
    rebarConfigTitle: 'Production Erlang/OTP Configuration'
  }
};
