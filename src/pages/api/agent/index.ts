import type { NextApiRequest, NextApiResponse } from 'next';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { agent_id, action, result, anomaly, amount, timestamp } = req.body;

    if (!agent_id || !action) {
      return res.status(400).json({ error: 'agent_id and action are required' });
    }

    const alerts = [];
    if (anomaly) alerts.push(`Anomalous action: ${action}`);
    if (amount && amount > 1000) alerts.push(`Large transaction: $${amount}`);

    await sql`
      INSERT INTO agent_logs (agent_id, action, result, anomaly, amount, timestamp)
      VALUES (
        ${agent_id},
        ${action},
        ${result || 'success'},
        ${anomaly || false},
        ${amount || null},
        ${timestamp || new Date().toISOString()}
      )
    `;

    console.log(`[ToyuguoSec] ${agent_id}: ${action}`);

    return res.status(200).json({ success: true, alerts });
  }

  if (req.method === 'GET') {
    const logs = await sql`
      SELECT * FROM agent_logs
      ORDER BY received_at DESC
      LIMIT 100
    `;

    const agentMap: Record<string, any> = {};
    logs.forEach((log: any) => {
      if (!agentMap[log.agent_id]) {
        agentMap[log.agent_id] = {
          agent_id: log.agent_id,
          total: 0,
          anomalies: 0,
          failures: 0,
        };
      }
      agentMap[log.agent_id].total += 1;
      if (log.anomaly) agentMap[log.agent_id].anomalies += 1;
      if (log.result === 'failed') agentMap[log.agent_id].failures += 1;
    });

    const agents = Object.values(agentMap).map((a: any) => ({
      ...a,
      credit_score: Math.max(0, Math.round(
        100 - (a.anomalies / a.total) * 50 - (a.failures / a.total) * 30
      )),
    }));

    return res.status(200).json({
      total_logs: logs.length,
      total_agents: agents.length,
      agents,
      recent_logs: logs.slice(0, 10),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}