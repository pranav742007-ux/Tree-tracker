"use client"

import { useState, useEffect } from "react"
import {
  TreePine,
  Cloud,
  Droplets,
  Users,
  Activity,
  MapPin,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Plus,
  Loader2
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

// Static map to map API string IDs back to Lucide Icons
const iconMap: Record<string, any> = {
  trees: TreePine,
  co2: Cloud,
  water: Droplets,
  volunteers: Users,
  survival: Activity
};

const MONTHLY_DATA = [
  { month: "Jan", trees: 1200 },
  { month: "Feb", trees: 1800 },
  { month: "Mar", trees: 2400 },
  { month: "Apr", trees: 3100 },
  { month: "May", trees: 2800 },
  { month: "Jun", trees: 3500 },
  { month: "Jul", trees: 4200 },
  { month: "Aug", trees: 3900 },
  { month: "Sep", trees: 4600 },
  { month: "Oct", trees: 5100 },
  { month: "Nov", trees: 4800 },
  { month: "Dec", trees: 5400 },
]

// Helper to generate deterministic UI fields for DB trees
const generateTreeUI = (tree: any) => {
  // Simple hash of ID to generate consistent fake growth/health since it's not in DB yet
  const hash = tree.id.charCodeAt(tree.id.length - 1) || 50;
  const growth = 30 + (hash % 70); // 30-100
  let health = "Stable";
  if (growth > 75) health = "Optimal";
  else if (growth < 45) health = "Needs Water";

  return {
    ...tree,
    growth,
    health,
    planted: new Date(tree.plantedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

function getHealthColor(health: string) {
  switch (health) {
    case "Optimal":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    case "Stable":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "Needs Water":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-4 py-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-lg font-bold text-primary">{payload[0].value.toLocaleString()} tons</p>
      </div>
    )
  }
  return null
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-4 py-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-lg font-bold text-primary">{payload[0].value.toLocaleString()} trees</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [showAll, setShowAll] = useState(false)
  
  // Real-time API state
  const [metrics, setMetrics] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [dbTrees, setDbTrees] = useState<any[]>([])
  const [isLive, setIsLive] = useState(false)
  const [isPlanting, setIsPlanting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // New Tree Form State
  const [newSpecies, setNewSpecies] = useState("")
  const [newLocation, setNewLocation] = useState("")

  const fetchTrees = async () => {
    try {
      const res = await fetch('/api/trees')
      if (res.ok) {
        const data = await res.json()
        setDbTrees(data.map(generateTreeUI))
      }
    } catch (e) {
      console.error("Failed to fetch trees:", e)
    }
  }

  // Fetch real-time data
  useEffect(() => {
    setMounted(true)
    
    const fetchLiveMetrics = async () => {
      try {
        const res = await fetch('/api/metrics')
        if (res.ok) {
          const data = await res.json()
          setMetrics(data.metrics)
          setChartData(data.chartData)
          setIsLive(true)
        }
      } catch (error) {
        console.error("Failed to fetch live metrics:", error)
      }
    }

    // Initial fetch
    fetchLiveMetrics()
    fetchTrees()

    // Poll every 5 seconds for live updates
    const interval = setInterval(() => {
      fetchLiveMetrics()
      fetchTrees()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePlantTree = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSpecies || !newLocation) return

    setIsPlanting(true)
    try {
      const res = await fetch('/api/trees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          species: newSpecies,
          location: newLocation,
          latitude: 0,
          longitude: 0
        })
      })
      if (res.ok) {
        await fetchTrees()
        setNewSpecies("")
        setNewLocation("")
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Planting failed:", error)
    } finally {
      setIsPlanting(false)
    }
  }

  const visibleTrees = showAll ? dbTrees : dbTrees.slice(0, 8)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 md:pt-32 pb-32 md:pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track your environmental impact in real-time.</p>
          </div>

          {/* Metrics Row */}
          <div className="flex items-center gap-2 mb-4 text-xs font-medium text-emerald-400 bg-emerald-500/10 w-max px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Data Feed {isLive ? "Active" : "Connecting..."}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {metrics.map((metric, i) => {
              const Icon = iconMap[metric.iconId] || Activity
              return (
                <div
                  key={metric.label}
                  className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-transform animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              )
            })}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Area Chart */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up [animation-delay:150ms]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">CO₂ Sequestration Trends</h3>
                  <p className="text-sm text-muted-foreground">Annual carbon capture progress</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>+28.4%</span>
                </div>
              </div>
              <div className="h-72">
                {mounted && chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 222, 128, 0.15)" />
                      <XAxis
                        dataKey="year"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="co2"
                        stroke="#4ade80"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCo2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="animate-pulse">Loading chart…</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart – Monthly Plantings */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up [animation-delay:200ms]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Monthly Plantings</h3>
                  <p className="text-sm text-muted-foreground">Trees planted per month in 2026</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <TreePine className="h-4 w-4" />
                  <span>42.8K total</span>
                </div>
              </div>
              <div className="h-72">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 222, 128, 0.15)" />
                      <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<BarTooltip />} />
                      <Bar
                        dataKey="trees"
                        fill="#4ade80"
                        radius={[6, 6, 0, 0]}
                        opacity={0.8}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="animate-pulse">Loading chart…</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in-up [animation-delay:250ms]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Global Impact Map</h3>
                <p className="text-sm text-muted-foreground">Tree distribution worldwide</p>
              </div>
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="h-72 rounded-xl bg-secondary/30 flex items-center justify-center relative overflow-hidden">
              {/* Stylized Map Placeholder */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <ellipse cx="200" cy="100" rx="150" ry="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                  <ellipse cx="200" cy="100" rx="120" ry="65" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                  <ellipse cx="200" cy="100" rx="90" ry="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                  <ellipse cx="200" cy="100" rx="60" ry="35" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                </svg>
              </div>
              {/* Static dots representing trees */}
              {[
                { left: "15%", top: "35%", label: "North America" },
                { left: "25%", top: "55%", label: "South America" },
                { left: "45%", top: "30%", label: "Europe" },
                { left: "48%", top: "50%", label: "Africa" },
                { left: "62%", top: "38%", label: "Asia" },
                { left: "78%", top: "58%", label: "Oceania" },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute flex flex-col items-center gap-1"
                  style={{ left: pos.left, top: pos.top }}
                >
                  <div
                    className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"
                    style={{ animationDelay: `${i * 300}ms` }}
                  />
                  <span className="text-[10px] text-muted-foreground font-medium hidden md:block">{pos.label}</span>
                </div>
              ))}
              <div className="relative z-10 text-center">
                <div className="text-4xl font-bold text-primary mb-2">120+</div>
                <div className="text-sm text-muted-foreground">Countries Active</div>
              </div>
            </div>
          </div>

          {/* Live Inventory Table */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up [animation-delay:300ms]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Live Database Inventory</h3>
                <p className="text-sm text-muted-foreground">Recently tracked saplings — {dbTrees.length} total</p>
              </div>
              <div className="flex items-center gap-3">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="rounded-xl flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Log a Tree
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] glass-card border-border/50">
                    <DialogHeader>
                      <DialogTitle>Plant a New Tree</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePlantTree} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Species</label>
                        <Input 
                          placeholder="e.g. White Oak" 
                          value={newSpecies}
                          onChange={(e) => setNewSpecies(e.target.value)}
                          className="bg-secondary/50 border-border/50"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input 
                          placeholder="e.g. Seattle, WA" 
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          className="bg-secondary/50 border-border/50"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isPlanting}>
                        {isPlanting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {isPlanting ? "Saving to Database..." : "Log Tree in DB"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-2"
                >
                  {showAll ? (
                    <>Show Less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>View All <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Tree ID</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Species</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Location</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Planted</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Growth Index</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Health Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTrees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No trees in the database yet. Click "Log a Tree" to add one!
                      </td>
                    </tr>
                  ) : (
                    visibleTrees.map((tree) => (
                      <tr
                        key={tree.id}
                        className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-primary">{tree.id.slice(0,8).toUpperCase()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium">{tree.species}</span>
                          {tree.user?.name && <div className="text-xs text-muted-foreground">by {tree.user.name}</div>}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-muted-foreground text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {tree.location}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-muted-foreground text-sm">{tree.planted}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${tree.growth}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{tree.growth}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getHealthColor(tree.health)}`}>
                            {tree.health}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
