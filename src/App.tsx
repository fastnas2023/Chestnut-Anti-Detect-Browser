import React, { useEffect, useState } from 'react';

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState('');
  const [proxy, setProxy] = useState('');
  const [agentTask, setAgentTask] = useState('Apple Vision Pro');
  const [logs, setLogs] = useState<string[]>([]);

  const loadProfiles = async () => {
    const data = await window.api.getProfiles();
    setProfiles(data);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.api.createProfile({
      name,
      proxy,
      canvasSeed: Math.random().toString(36).substring(7)
    });
    setName('');
    setProxy('');
    loadProfiles();
  };

  const handleLaunch = async (id: number) => {
    addLog(`Launching profile ${id}...`);
    const success = await window.api.launchProfile(id);
    if (success) {
      addLog(`Profile ${id} launched successfully. Ready for Agent.`);
    } else {
      addLog(`Failed to launch profile ${id}.`);
    }
  };

  const handleRunAgent = async (id: number) => {
    addLog(`Dispatching agent to profile ${id} with task: "${agentTask}"`);
    const result = await window.api.runAgent(id, agentTask);
    if (result.success) {
      addLog(`Agent Success: ${result.message}`);
    } else {
      addLog(`Agent Error: ${result.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 2 }}>
        <h1>Multi-Agent Anti-Detect Browser</h1>
        
        <form onSubmit={handleCreate} style={{ marginBottom: '20px' }}>
          <input 
            placeholder="Profile Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            style={{ marginRight: '10px' }}
          />
          <input 
            placeholder="Proxy (e.g. socks5://ip:port)" 
            value={proxy} 
            onChange={e => setProxy(e.target.value)} 
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Create Profile</button>
        </form>

        <div style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Agent Task Setup</h3>
          <input 
            placeholder="What should the agent search for?" 
            value={agentTask} 
            onChange={e => setAgentTask(e.target.value)} 
            style={{ width: '300px', marginRight: '10px' }}
          />
          <small>(Phase 3 tests Google Search automation)</small>
        </div>

        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc' }}>ID</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Name</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.id}>
                <td style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>{p.id}</td>
                <td style={{ borderBottom: '1px solid #eee' }}>{p.name}</td>
                <td style={{ borderBottom: '1px solid #eee' }}>
                  <button onClick={() => p.id && handleLaunch(p.id)} style={{ marginRight: '5px' }}>1. Launch Browser</button>
                  <button onClick={() => p.id && handleRunAgent(p.id)} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>2. Run Agent</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ flex: 1, background: '#1e1e1e', color: '#00ff00', padding: '15px', borderRadius: '8px', height: '80vh', overflowY: 'auto' }}>
        <h3>Agent Logs</h3>
        <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '5px' }}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
