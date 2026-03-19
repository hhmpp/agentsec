'use client';

import { useEffect, useState } from 'react';

type Agent = {
  agent_id: string;
  total: number;
  anomalies: number;
  failures: number;
  credit_score: number;
};

type Log = {
  id: number;
  agent_id: string;
  action: string;
  result: string;
  anomaly: boolean;
  amount: number | null;
  timestamp: string;
};

type DashboardData = {
  total_logs: number;
  total_agents: number;
  agents: Agent[];
  recent_logs: Log[];
};

const DashboardIndexPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/agent');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">ToyuguoSec Dashboard</h1>
      <p className="text-muted-foreground mb-8">Real-time Agent monitoring</p>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Agents</p>
          <p className="text-3xl font-bold">{data?.total_agents ?? 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Logs</p>
          <p className="text-3xl font-bold">{data?.total_logs ?? 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Anomalies</p>
          <p className="text-3xl font-bold text-red-500">
            {data?.agents.reduce((sum, a) => sum + a.anomalies, 0) ?? 0}
          </p>
        </div>
      </div>

      {/* Agent 列表 */}
      <h2 className="text-lg font-semibold mb-4">Registered Agents</h2>
      <div className="rounded-lg border mb-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Agent ID</th>
              <th className="text-left p-3">Credit Score</th>
              <th className="text-left p-3">Total Actions</th>
              <th className="text-left p-3">Anomalies</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.agents.map(agent => (
              <tr key={agent.agent_id} className="border-t">
                <td className="p-3 font-mono text-xs">{agent.agent_id}</td>
                <td className="p-3">
                  <span className={`font-bold ${agent.credit_score >= 80 ? 'text-green-500' : agent.credit_score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {agent.credit_score}/100
                  </span>
                </td>
                <td className="p-3">{agent.total}</td>
                <td className="p-3">{agent.anomalies}</td>
                <td className="p-3">
                  {agent.anomalies > 0
                    ? <span className="text-red-500">⚠️ Alert</span>
                    : <span className="text-green-500">✅ Normal</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 最近日志 */}
      <h2 className="text-lg font-semibold mb-4">Recent Logs</h2>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">Agent ID</th>
              <th className="text-left p-3">Action</th>
              <th className="text-left p-3">Result</th>
              <th className="text-left p-3">Anomaly</th>
            </tr>
          </thead>
          <tbody>
            {data?.recent_logs.map(log => (
              <tr key={log.id} className="border-t">
                <td className="p-3 text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="p-3 font-mono text-xs">{log.agent_id.slice(0, 16)}...</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">
                  <span className={log.result === 'success' ? 'text-green-500' : 'text-red-500'}>
                    {log.result}
                  </span>
                </td>
                <td className="p-3">
                  {log.anomaly ? '⚠️ Yes' : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardIndexPage;
