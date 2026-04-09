import React, { useEffect, useState } from 'react';

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState('');
  const [proxy, setProxy] = useState('');

  const loadProfiles = async () => {
    const data = await window.api.getProfiles();
    setProfiles(data);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

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
    await window.api.launchProfile(id);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Anti-Detect Browser Profiles</h1>
      
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

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc' }}>ID</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Name</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Proxy</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Canvas Seed</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map(p => (
            <tr key={p.id}>
              <td style={{ borderBottom: '1px solid #eee' }}>{p.id}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{p.name}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{p.proxy || 'None'}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{p.canvasSeed}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>
                <button onClick={() => p.id && handleLaunch(p.id)}>Launch</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}