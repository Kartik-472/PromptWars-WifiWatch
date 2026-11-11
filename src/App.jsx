
import { useMemo, useState } from "react";
import {
  ShieldCheck, LayoutDashboard, Router, Monitor, AlertTriangle,
  ChartNoAxesCombined, Settings, Search, Bell, RefreshCw, Wifi,
  Laptop, Smartphone, Tv, Printer, Gamepad2, Speaker, CircleHelp,
  ArrowDownToLine, ArrowUpFromLine, Activity, ShieldAlert, Check,
  X, Menu, ChevronRight, Scan, Eye, Lock, Clock, Zap
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell
} from "recharts";
import {
  initialDevices, initialAlerts, trafficData, securityChecks
} from "./data/mockData";

const navigation = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "devices", label: "Devices", icon: Monitor },
  { id: "threats", label: "Threat Detection", icon: ShieldAlert },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { id: "security", label: "Security Center", icon: ShieldCheck }
];

const severityStyle = {
  High: "bg-red-500/10 text-red-400 border-red-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Low: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
};

const deviceIcons = {
  Laptop, Mobile: Smartphone, "Smart TV": Tv,
  Printer, Console: Gamepad2, IoT: Speaker, Unknown: CircleHelp
};

function Badge({ children, color = "cyan" }) {
  const colors = {
    cyan: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
    green: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    amber: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    red: "bg-red-400/10 text-red-300 border-red-400/20",
    slate: "bg-slate-700/60 text-slate-300 border-slate-600/40"
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${colors[color]}`}>{children}</span>;
}

function Card({ children, className = "" }) {
  return <section className={`rounded-2xl border border-slate-800 bg-[#111c2d] ${className}`}>{children}</section>;
}

function StatCard({ label, value, detail, icon: Icon, color = "cyan" }) {
  const styles = {
    cyan: "bg-cyan-400/10 text-cyan-300",
    green: "bg-emerald-400/10 text-emerald-300",
    amber: "bg-amber-400/10 text-amber-300",
    red: "bg-red-400/10 text-red-300"
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</h3>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={`rounded-xl p-3 ${styles[color]}`}><Icon size={21} /></div>
      </div>
    </Card>
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [devices, setDevices] = useState(initialDevices);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [checks, setChecks] = useState(securityChecks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [notice, setNotice] = useState("");
  const [lastScan, setLastScan] = useState("Just now");

  const onlineDevices = devices.filter(d => d.status === "Online").length;
  const unknownDevices = devices.filter(d => !d.trusted && d.status === "Online").length;
  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;

  const filteredDevices = useMemo(() => devices.filter(device => {
    const matchesSearch = `${device.name} ${device.ip} ${device.mac}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || (filter === "Unknown" ? !device.trusted : device.status === filter);
    return matchesSearch && matchesFilter;
  }), [devices, search, filter]);

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function runScan() {
    if (scanning) return;
    setScanning(true);
    notify("Simulated network scan started.");
    window.setTimeout(() => {
      setScanning(false);
      setLastScan("Just now");
      notify("Demo scan complete. Network inventory refreshed.");
    }, 1800);
  }

  function toggleBlock(id) {
    setDevices(current => current.map(device =>
      device.id === id ? { ...device, status: device.status === "Blocked" ? "Online" : "Blocked" } : device
    ));
    const target = devices.find(d => d.id === id);
    notify(target?.status === "Blocked" ? "Device restored in demo." : "Device marked as blocked in demo.");
  }

  function resolveAlert(id) {
    setAlerts(current => current.map(alert =>
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    setSelectedAlert(null);
    notify("Alert marked as resolved in demo.");
  }

  function addDemoDevice() {
    const id = Math.max(0, ...devices.map(d => d.id)) + 1;
    const newDevice = {
      id,
      name: `New Unknown Device ${id}`,
      ip: `192.168.1.${20 + id}`,
      mac: `F0:11:22:33:44:${String(id).padStart(2, "0")}`,
      type: "Unknown",
      status: "Online",
      trusted: false,
      usage: 3.4
    };
    setDevices(current => [newDevice, ...current]);
    setAlerts(current => [{
      id: Date.now(),
      title: "Unknown device detected",
      description: `${newDevice.name} appeared in the simulated network inventory.`,
      severity: "Medium",
      time: "Just now",
      type: "device",
      resolved: false
    }, ...current]);
    notify("Demo device added to the inventory.");
  }

  function toggleCheck(id) {
    setChecks(current => current.map(check =>
      check.id === id ? { ...check, status: check.status === "pass" ? "warning" : "pass" } : check
    ));
  }

  const trafficTotal = devices.filter(d => d.status === "Online").reduce((sum, d) => sum + d.usage, 0);
  const health = Math.max(55, 100 - unknownDevices * 3 - unresolvedAlerts * 2);

  const pageTitle = navigation.find(n => n.id === page)?.label || "Overview";

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-slate-800 bg-[#0d1726]">
      <div className="flex h-[76px] items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
          <ShieldCheck size={23} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">WiFi<span className="text-cyan-300">Watch</span></h1>
          <p className="text-[10px] font-semibold tracking-[.18em] text-slate-500">NETWORK INTELLIGENCE</p>
        </div>
      </div>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</p>
        <nav className="space-y-1">
          {navigation.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { setPage(item.id); setMobileOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${page === item.id ? "bg-cyan-400/10 font-semibold text-cyan-300" : "text-slate-400 hover:bg-slate-800/70 hover:text-white"}`}>
                <Icon size={18} />
                <span>{item.label}</span>
                {item.id === "threats" && unresolvedAlerts > 0 && <span className="ml-auto rounded-full bg-red-400/15 px-2 py-0.5 text-xs text-red-300">{unresolvedAlerts}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-cyan-300"><Activity size={16} /><span className="text-xs font-semibold">Demo environment</span></div>
          <p className="text-xs leading-relaxed text-slate-400">All device and traffic information is simulated for demonstration.</p>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-slate-800 px-2 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">K</div>
          <div><p className="text-sm font-medium text-white">Network Admin</p><p className="text-xs text-slate-500">Demo workspace</p></div>
        </div>
      </div>
    </aside>
  );

  function DeviceTable({ compact = false }) {
    const rows = compact ? filteredDevices.slice(0, 5) : filteredDevices;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Device</th>
              <th className="px-5 py-3 font-medium">IP address</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Usage</th>
              {!compact && <th className="px-5 py-3 font-medium">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {rows.map(device => {
              const Icon = deviceIcons[device.type] || CircleHelp;
              return (
                <tr key={device.id} className="transition hover:bg-slate-800/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-800 p-2 text-slate-300"><Icon size={17} /></div>
                      <div><p className="font-medium text-slate-200">{device.name}</p><p className="text-xs text-slate-500">{device.mac}</p></div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-400">{device.ip}</td>
                  <td className="px-5 py-4 text-slate-400">{device.type}</td>
                  <td className="px-5 py-4"><Badge color={device.status === "Online" ? "green" : device.status === "Blocked" ? "red" : "slate"}>{device.status}</Badge></td>
                  <td className="px-5 py-4 text-slate-300">{device.usage.toFixed(1)} MB</td>
                  {!compact && <td className="px-5 py-4">
                    <button onClick={() => toggleBlock(device.id)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300">
                      {device.status === "Blocked" ? "Unblock" : "Block"}
                    </button>
                  </td>}
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No matching devices found.</div>}
      </div>
    );
  }

  function AlertList({ limit }) {
    const items = (limit ? alerts.slice(0, limit) : alerts);
    return (
      <div className="divide-y divide-slate-800">
        {items.map(alert => (
          <div key={alert.id} className="flex items-start gap-3 p-4">
            <div className={`mt-0.5 rounded-lg p-2 ${alert.severity === "High" ? "bg-red-400/10 text-red-300" : alert.severity === "Medium" ? "bg-amber-400/10 text-amber-300" : "bg-cyan-400/10 text-cyan-300"}`}>
              <AlertTriangle size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium text-slate-200">{alert.title}</p><Badge color={alert.severity === "High" ? "red" : alert.severity === "Medium" ? "amber" : "cyan"}>{alert.severity}</Badge>{alert.resolved && <Badge color="green">Resolved</Badge>}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{alert.description}</p>
              <div className="mt-2 flex items-center gap-3"><span className="text-[11px] text-slate-500">{alert.time}</span><button onClick={() => setSelectedAlert(alert)} className="text-xs font-medium text-cyan-300 hover:text-cyan-200">Investigate <ChevronRight size={13} className="inline" /></button></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function Dashboard() {
    return (
      <>
        <SectionTitle title="Network Overview" subtitle="Monitor your network environment and security posture."
          action={<button onClick={runScan} disabled={scanning} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"><Scan size={16} />{scanning ? "Scanning..." : "Scan network"}</button>} />

        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Network health" value={`${health}/100`} detail="Calculated from demo alerts" icon={ShieldCheck} color="green" />
          <StatCard label="Connected devices" value={onlineDevices} detail={`${devices.length - onlineDevices} offline or blocked`} icon={Monitor} />
          <StatCard label="Unknown devices" value={unknownDevices} detail="Require review" icon={CircleHelp} color="amber" />
          <StatCard label="Unresolved alerts" value={unresolvedAlerts} detail="Across this demo network" icon={AlertTriangle} color="red" />
        </div>

        <div className="mb-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
          <Card className="p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div><h3 className="font-semibold text-white">Network traffic</h3><p className="mt-1 text-xs text-slate-500">Simulated bandwidth activity</p></div>
              <Badge color="green"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" /> Demo data</Badge>
            </div>
            <div className="mb-4 flex gap-6">
              <div><p className="text-xs text-slate-500">Download</p><p className="mt-1 text-xl font-semibold text-cyan-300">84.6 <span className="text-xs font-normal text-slate-500">Mbps</span></p></div>
              <div><p className="text-xs text-slate-500">Upload</p><p className="mt-1 text-xl font-semibold text-violet-300">26.4 <span className="text-xs font-normal text-slate-500">Mbps</span></p></div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs><linearGradient id="downloadFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient><linearGradient id="uploadFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity={0.25} /><stop offset="100%" stopColor="#a78bfa" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid stroke="#263449" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0d1726", border: "1px solid #334155", borderRadius: 12, color: "#e2e8f0" }} />
                  <Area type="monotone" dataKey="download" stroke="#22d3ee" fill="url(#downloadFill)" strokeWidth={2} name="Download" />
                  <Area type="monotone" dataKey="upload" stroke="#a78bfa" fill="url(#uploadFill)" strokeWidth={2} name="Upload" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4"><h3 className="font-semibold text-white">Device distribution</h3><p className="mt-1 text-xs text-slate-500">Inventory by device type</p></div>
            <div className="relative h-[205px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={[{ name: "Trusted", value: devices.filter(d => d.trusted).length }, { name: "Unknown", value: unknownDevices }, { name: "Offline/blocked", value: devices.filter(d => d.status !== "Online").length }]} dataKey="value" nameKey="name" innerRadius={55} outerRadius={78} paddingAngle={4}>
                  {["#22d3ee", "#f59e0b", "#64748b"].map((color, i) => <Cell key={i} fill={color} />)}
                </Pie><Tooltip contentStyle={{ background: "#0d1726", border: "1px solid #334155", borderRadius: 12 }} /></PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-semibold text-white">{devices.length}</span><span className="text-xs text-slate-500">Devices</span></div>
            </div>
            <div className="space-y-3">
              {[["Trusted", "#22d3ee", devices.filter(d => d.trusted).length], ["Unknown", "#f59e0b", unknownDevices], ["Offline / blocked", "#64748b", devices.filter(d => d.status !== "Online").length]].map(([label, color, value]) => <div key={label} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-slate-400"><span className="h-2 w-2 rounded-full" style={{ background: color }} />{label}</span><span className="font-semibold text-slate-200">{value}</span></div>)}
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-slate-800 p-5"><div><h3 className="font-semibold text-white">Connected devices</h3><p className="mt-1 text-xs text-slate-500">Latest network inventory</p></div><button onClick={() => setPage("devices")} className="text-xs font-semibold text-cyan-300">View all <ChevronRight className="inline" size={14} /></button></div><DeviceTable compact /></Card>
          <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-slate-800 p-5"><div><h3 className="font-semibold text-white">Recent alerts</h3><p className="mt-1 text-xs text-slate-500">Security events and notifications</p></div><button onClick={() => setPage("threats")} className="text-xs font-semibold text-cyan-300">View all <ChevronRight className="inline" size={14} /></button></div><AlertList limit={3} /></Card>
        </div>
      </>
    );
  }

  function DevicesPage() {
    return (
      <>
        <SectionTitle title="Device Monitor" subtitle="Review devices in the simulated network inventory."
          action={<div className="flex gap-2"><button onClick={addDemoDevice} className="rounded-xl border border-slate-700 px-3 py-2.5 text-xs font-medium text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300">+ Add demo device</button><button onClick={runScan} disabled={scanning} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"><Scan size={15} />{scanning ? "Scanning" : "Scan"}</button></div>} />
        <div className="mb-5 grid gap-4 sm:grid-cols-3"><StatCard label="Total inventory" value={devices.length} detail="Recorded demo devices" icon={Monitor} /><StatCard label="Online" value={onlineDevices} detail="Currently marked online" icon={Wifi} color="green" /><StatCard label="Unrecognized" value={unknownDevices} detail="Not marked as trusted" icon={AlertTriangle} color="amber" /></div>
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-800 p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, IP or MAC..." className="w-full rounded-xl border border-slate-700 bg-[#0c1625] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/60" /></div>
            <div className="flex flex-wrap gap-2">{["All", "Online", "Offline", "Unknown"].map(value => <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-xs font-medium ${filter === value ? "bg-cyan-400/10 text-cyan-300" : "bg-slate-800 text-slate-400 hover:text-white"}`}>{value}</button>)}</div>
          </div>
          <DeviceTable />
        </Card>
        <p className="mt-3 text-xs text-slate-500">Block/unblock actions only change the local demo state. They do not affect real network devices.</p>
      </>
    );
  }

  function ThreatsPage() {
    return (
      <>
        <SectionTitle title="Threat Detection" subtitle="Review and investigate simulated security events." action={<Badge color="amber">{unresolvedAlerts} open alerts</Badge>} />
        <div className="mb-5 grid gap-4 sm:grid-cols-3"><StatCard label="Total alerts" value={alerts.length} detail="All recorded demo events" icon={Bell} /><StatCard label="High severity" value={alerts.filter(a => a.severity === "High" && !a.resolved).length} detail="Open high-priority alerts" icon={ShieldAlert} color="red" /><StatCard label="Resolved" value={alerts.filter(a => a.resolved).length} detail="Marked resolved" icon={Check} color="green" /></div>
        <Card><div className="border-b border-slate-800 p-5"><h3 className="font-semibold text-white">Security event feed</h3><p className="mt-1 text-xs text-slate-500">Select an alert to inspect its details and recommended actions.</p></div><AlertList /></Card>
      </>
    );
  }

  function AnalyticsPage() {
    return (
      <>
        <SectionTitle title="Network Analytics" subtitle="Explore simulated bandwidth and device activity." action={<Badge color="cyan">Sample dataset</Badge>} />
        <div className="mb-5 grid gap-4 sm:grid-cols-3"><StatCard label="Download peak" value="84.6 Mbps" detail="Highest sample interval" icon={ArrowDownToLine} /><StatCard label="Upload peak" value="26.4 Mbps" detail="Highest sample interval" icon={ArrowUpFromLine} /><StatCard label="Device usage total" value={`${trafficTotal.toFixed(1)} MB`} detail="Sum of online device sample usage" icon={Activity} /></div>
        <Card className="mb-5 p-5"><h3 className="font-semibold text-white">Bandwidth over time</h3><p className="mt-1 text-xs text-slate-500">Sample download and upload throughput</p><div className="mt-6 h-[340px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trafficData}><CartesianGrid stroke="#263449" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="time" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: "#0d1726", border: "1px solid #334155", borderRadius: 12 }} /><Area type="monotone" dataKey="download" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.12} strokeWidth={2} name="Download" /><Area type="monotone" dataKey="upload" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.1} strokeWidth={2} name="Upload" /></AreaChart></ResponsiveContainer></div></Card>
        <Card className="p-5"><h3 className="mb-4 font-semibold text-white">Top device usage</h3><div className="space-y-5">{[...devices].sort((a, b) => b.usage - a.usage).slice(0, 5).map(device => <div key={device.id}><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">{device.name}</span><span className="text-slate-400">{device.usage.toFixed(1)} MB</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min(device.usage / 30 * 100, 100)}%` }} /></div></div>)}</div></Card>
      </>
    );
  }

  function SecurityPage() {
    const passed = checks.filter(c => c.status === "pass").length;
    return (
      <>
        <SectionTitle title="Security Center" subtitle="A practical checklist for strengthening a home or campus Wi-Fi setup." action={<Badge color={passed === checks.length ? "green" : "amber"}>{passed}/{checks.length} checks complete</Badge>} />
        <Card className="mb-5 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"><ShieldCheck size={30} /></div><div className="flex-1"><h3 className="font-semibold text-white">Security readiness checklist</h3><p className="mt-1 text-sm text-slate-400">Mark each recommendation as reviewed when you've checked the setting on your actual router.</p></div><div className="text-3xl font-semibold text-cyan-300">{Math.round(passed / checks.length * 100)}%</div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${passed / checks.length * 100}%` }} /></div></Card>
        <div className="space-y-3">{checks.map(check => <Card key={check.id} className="flex items-center gap-4 p-4"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${check.status === "pass" ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>{check.status === "pass" ? <Check size={20} /> : <AlertTriangle size={20} />}</div><div className="min-w-0 flex-1"><h4 className="text-sm font-medium text-slate-200">{check.title}</h4><p className="mt-1 text-xs text-slate-500">{check.description}</p></div><button onClick={() => toggleCheck(check.id)} className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium ${check.status === "pass" ? "border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10" : "border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300"}`}>{check.status === "pass" ? "Reviewed" : "Mark reviewed"}</button></Card>)}</div>
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4"><div className="flex items-center gap-2 text-amber-300"><Lock size={16} /><p className="text-sm font-semibold">Security note</p></div><p className="mt-2 text-xs leading-relaxed text-slate-400">This checklist is educational guidance, not a live router audit. WiFiWatch does not inspect your router or verify these settings.</p></div>
      </>
    );
  }

  const pageContent = {
    dashboard: <Dashboard />,
    devices: <DevicesPage />,
    threats: <ThreatsPage />,
    analytics: <AnalyticsPage />,
    security: <SecurityPage />
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-200">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-[255px] lg:block">{sidebar}</div>

      {mobileOpen && <div className="fixed inset-0 z-40 lg:hidden"><button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/70" /><div className="relative h-full w-[280px]">{sidebar}</div></div>}

      <div className="lg:pl-[255px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-800 bg-[#0b1220]/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"><Menu size={20} /></button>
            <div><p className="text-sm font-semibold text-white">{pageTitle}</p><p className="hidden text-xs text-slate-500 sm:block">Workspace / {pageTitle}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Badge color="green"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" /> Demo active</Badge>
            <button onClick={() => notify("You are all caught up.")} aria-label="Notifications" className="relative rounded-xl border border-slate-800 p-2.5 text-slate-400 hover:text-white"><Bell size={18} />{unresolvedAlerts > 0 && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-400" />}</button>
            <button onClick={runScan} disabled={scanning} aria-label="Refresh scan" className="rounded-xl border border-slate-800 p-2.5 text-slate-400 hover:text-cyan-300 disabled:opacity-50"><RefreshCw size={17} className={scanning ? "animate-spin" : ""} /></button>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-400"><Activity size={15} className="text-cyan-300" /><span>Demo environment: all network activity and security findings are simulated.</span></div>
            <span className="text-[11px] text-slate-500">Last scan: {lastScan}</span>
          </div>
          {pageContent[page]}
          <footer className="mt-10 border-t border-slate-800 pt-5 text-center text-xs text-slate-600">WiFiWatch · Network Intelligence Platform · Hackathon Prototype</footer>
        </main>
      </div>

      {notice && <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-cyan-400/20 bg-[#142236] px-4 py-3 text-sm text-slate-200 shadow-2xl"><Check size={17} className="text-cyan-300" />{notice}</div>}

      {selectedAlert && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedAlert(null)}><div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#111c2d] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><Badge color={selectedAlert.severity === "High" ? "red" : selectedAlert.severity === "Medium" ? "amber" : "cyan"}>{selectedAlert.severity} severity</Badge><h3 className="mt-4 text-xl font-semibold text-white">{selectedAlert.title}</h3></div><button onClick={() => setSelectedAlert(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"><X size={19} /></button></div><p className="mt-3 text-sm leading-relaxed text-slate-400">{selectedAlert.description}</p><div className="mt-5 rounded-xl border border-slate-800 bg-[#0b1422] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Investigation details</p><div className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-500">Event ID</span><span className="text-slate-300">WW-{selectedAlert.id}</span></div><div className="flex justify-between"><span className="text-slate-500">Event type</span><span className="text-slate-300 capitalize">{selectedAlert.type}</span></div><div className="flex justify-between"><span className="text-slate-500">Detected</span><span className="text-slate-300">{selectedAlert.time}</span></div><div className="flex justify-between"><span className="text-slate-500">Status</span><span className="text-slate-300">{selectedAlert.resolved ? "Resolved" : "Open"}</span></div></div></div><p className="mt-4 text-xs leading-relaxed text-slate-500">This is a simulated event. It is not evidence of an actual intrusion or network compromise.</p>{!selectedAlert.resolved && <button onClick={() => resolveAlert(selectedAlert.id)} className="mt-5 w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">Mark as resolved</button>}</div></div>}
    </div>
  );
}

export default App;
