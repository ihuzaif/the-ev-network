import React, { useState, useEffect } from 'react';
import { 
  Activity, Play, RefreshCw, CheckCircle2, AlertTriangle, 
  Terminal, Zap, Settings, ShieldAlert, Sparkles, X
} from 'lucide-react';

export default function MissionControlTab() {
  const [agents, setAgents] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [triggerModalOpen, setTriggerModalOpen] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);
  const [logFilter, setLogFilter] = useState('ALL');

  // Trigger form state
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('Batteries');
  const [region, setRegion] = useState('India');
  const [runningCycle, setRunningCycle] = useState(false);

  const fetchStatusAndLogs = () => {
    fetch('/api/agents/status')
      .then(r => r.json())
      .then(d => {
        if (d.success) setAgents(d.agents);
      });

    fetch('/api/agents/logs?limit=40')
      .then(r => r.json())
      .then(d => {
        if (d.success) setLogs(d.logs);
      });

    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.settings) setAutoPublish(d.settings.autoPublish);
      });
  };

  useEffect(() => {
    fetchStatusAndLogs();
    const interval = setInterval(fetchStatusAndLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAutoPublish = async () => {
    const nextVal = !autoPublish;
    setAutoPublish(nextVal);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoPublish: nextVal })
    });
    fetchStatusAndLogs();
  };

  const handleTriggerRun = async (e) => {
    e.preventDefault();
    setRunningCycle(true);
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || null,
          category,
          region
        })
      });
      const data = await res.json();
      fetchStatusAndLogs();
      setTriggerModalOpen(false);
      setPrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setRunningCycle(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    if (logFilter === 'ALL') return true;
    return l.level === logFilter;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner & Trigger CTA */}
      <div className="bg-[#141822] rounded-2xl p-6 border border-[#263147] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h3 className="text-lg font-black text-white">
              Autonomous Newsroom Engine (24/7 Multi-Agent Fleet)
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Five specialized agents operate in pipeline: Scout &rarr; Editor &rarr; Media &rarr; Social &rarr; Dispatcher.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Auto-Publish Toggle */}
          <div className="flex items-center space-x-2 bg-[#1b202e] px-3 py-1.5 rounded-xl border border-[#2b354a] text-xs font-semibold">
            <span className="text-gray-300">Auto-Publish:</span>
            <button 
              onClick={handleToggleAutoPublish}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                autoPublish ? 'bg-emerald-600 text-white' : 'bg-amber-600/80 text-white'
              }`}>
              {autoPublish ? 'Direct to Live' : 'Save as Draft'}
            </button>
          </div>

          {/* Trigger Run Button */}
          <button 
            onClick={() => setTriggerModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 text-black px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-950/40">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Trigger Agent Run</span>
          </button>
        </div>
      </div>

      {/* Agents Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(agents).map(([key, agent]) => (
          <div key={key} className="bg-[#121622] rounded-xl p-4 border border-[#222b3d] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {agent.name}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>

            <p className="text-[11px] text-gray-400 leading-snug">
              {agent.role}
            </p>

            <div className="pt-2 border-t border-[#1e2535] flex justify-between text-[10px] font-mono text-gray-400">
              <span>Tasks: <strong className="text-white">{agent.tasksCompleted || 0}</strong></span>
              <span className="text-emerald-400 font-bold">{agent.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Agent Terminal Logs */}
      <div className="bg-[#0b0d13] rounded-2xl border border-[#202738] overflow-hidden shadow-xl">
        <div className="bg-[#131722] px-5 py-3 border-b border-[#202738] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-gray-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Live Agent Activity Log</span>
            <span className="text-gray-500">• Auto-refreshing</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] font-bold">
            {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLogFilter(lvl)}
                className={`px-2 py-0.5 rounded transition ${
                  logFilter === lvl ? 'bg-[#00aeef] text-black font-bold' : 'text-gray-400 hover:text-white bg-[#191f2c]'
                }`}>
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-2 bg-[#090b10]">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3 py-1 border-b border-[#141822] text-gray-300">
              <span className="text-gray-500 text-[10px] shrink-0 pt-0.5">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                log.level === 'SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' :
                log.level === 'WARN' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                log.level === 'ERROR' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' :
                'bg-blue-950 text-blue-300 border border-blue-800/50'
              }`}>
                {log.level}
              </span>
              <span className="text-gray-400 font-semibold shrink-0">
                [{log.agent}]:
              </span>
              <span className="text-gray-200 break-all leading-relaxed">
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trigger Agent Run Modal */}
      {triggerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121622] border border-[#2b3548] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setTriggerModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg bg-[#1a202d]">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Launch On-Demand Agent Cycle
                </h3>
                <p className="text-xs text-gray-400">
                  Provide an editorial topic or leave blank for autonomous web discovery.
                </p>
              </div>
            </div>

            <form onSubmit={handleTriggerRun} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 block">
                  Specific Topic / Headline Hook (Optional)
                </label>
                <textarea 
                  rows="2"
                  placeholder="e.g. Tata Motors reveals 800V SiC platform with Nvidia Thor compute"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00aeef]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 block">Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#0d1017] border border-[#273248] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00aeef]">
                    <option value="Cars">Cars &amp; SUVs</option>
                    <option value="Commercial">Commercial &amp; Fleets</option>
                    <option value="Charging">Charging &amp; Infra</option>
                    <option value="Batteries">Battery Tech</option>
                    <option value="Semiconductors">Semiconductors</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 block">Market Region</label>
                  <select 
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full bg-[#0d1017] border border-[#273248] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00aeef]">
                    <option value="India">India Focus 🇮🇳</option>
                    <option value="Global">Global Market 🌐</option>
                    <option value="USA">North America</option>
                    <option value="Europe">Europe</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setTriggerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-[#1a202d]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={runningCycle}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 shadow-lg shadow-cyan-950/50 flex items-center space-x-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{runningCycle ? 'Executing Multi-Agent Pipeline...' : 'Start Pipeline Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
