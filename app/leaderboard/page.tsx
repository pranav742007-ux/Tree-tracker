"use client"

import { useState } from "react"
import {
  Trophy,
  Medal,
  Search,
  TreePine,
  Flame,
  Star,
  Filter,
  ArrowUpDown
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { cn } from "@/lib/utils"

// Mock Contributors Data
const MOCK_CONTRIBUTORS = [
  { id: 1, name: "Sarah Chen", avatar: "SC", trees: 12847, level: "Legend", streak: 365, country: "China" },
  { id: 2, name: "Marcus Johnson", avatar: "MJ", trees: 11234, level: "Legend", streak: 289, country: "USA" },
  { id: 3, name: "Elena Rodriguez", avatar: "ER", trees: 9876, level: "Master", streak: 412, country: "Spain" },
  { id: 4, name: "David Kim", avatar: "DK", trees: 8543, level: "Master", streak: 156, country: "South Korea" },
  { id: 5, name: "Aisha Patel", avatar: "AP", trees: 7621, level: "Expert", streak: 98, country: "India" },
  { id: 6, name: "James Wilson", avatar: "JW", trees: 6789, level: "Expert", streak: 203, country: "UK" },
  { id: 7, name: "Maria Santos", avatar: "MS", trees: 5432, level: "Advanced", streak: 87, country: "Portugal" },
  { id: 8, name: "Alex Thompson", avatar: "AT", trees: 4567, level: "Advanced", streak: 145, country: "Australia" },
  { id: 9, name: "Yuki Tanaka", avatar: "YT", trees: 3890, level: "Intermediate", streak: 67, country: "Japan" },
  { id: 10, name: "Omar Hassan", avatar: "OH", trees: 3456, level: "Intermediate", streak: 54, country: "Egypt" },
  { id: 11, name: "Priya Iyer", avatar: "PI", trees: 3210, level: "Intermediate", streak: 112, country: "India" },
  { id: 12, name: "Luca Bianchi", avatar: "LB", trees: 2980, level: "Intermediate", streak: 43, country: "Italy" },
]

type SortField = "trees" | "streak" | "name"
type SortDir = "asc" | "desc"

function getLevelColor(level: string) {
  switch (level) {
    case "Legend":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "Master":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    case "Expert":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "Advanced":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    default:
      return "bg-muted text-muted-foreground border-muted"
  }
}

function getPodiumColor(position: number) {
  switch (position) {
    case 1:
      return "from-amber-500/30 to-amber-600/10 border-amber-500/40"
    case 2:
      return "from-slate-400/30 to-slate-500/10 border-slate-400/40"
    case 3:
      return "from-amber-700/30 to-amber-800/10 border-amber-700/40"
    default:
      return ""
  }
}

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("trees")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [filterLevel, setFilterLevel] = useState<string>("all")

  const topThree = MOCK_CONTRIBUTORS.slice(0, 3)

  // Filter and sort the rest of the leaderboard
  const restOfLeaderboard = MOCK_CONTRIBUTORS.slice(3)
    .filter((contributor) => {
      const matchesSearch = contributor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contributor.country.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterLevel === "all" || contributor.level === filterLevel
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      const multiplier = sortDir === "desc" ? -1 : 1
      if (sortField === "trees") return (a.trees - b.trees) * multiplier
      if (sortField === "streak") return (a.streak - b.streak) * multiplier
      if (sortField === "name") return a.name.localeCompare(b.name) * multiplier
      return 0
    })

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const totalTrees = MOCK_CONTRIBUTORS.reduce((sum, c) => sum + c.trees, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 md:pt-32 pb-32 md:pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">Top contributors making a difference worldwide.</p>
            <p className="text-sm text-primary mt-2 font-medium">{totalTrees.toLocaleString()} trees planted by our community</p>
          </div>

          {/* Podium Section */}
          <div className="glass-card rounded-3xl p-6 md:p-10 mb-8 animate-fade-in-up">
            <div className="flex items-end justify-center gap-4 md:gap-8">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl md:text-3xl font-bold border-2",
                    getPodiumColor(2)
                  )}>
                    {topThree[1].avatar}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center">
                    <Medal className="h-4 w-4 text-slate-900" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm md:text-base">{topThree[1].name}</div>
                  <div className="text-xs text-muted-foreground mb-1">{topThree[1].country}</div>
                  <div className="text-primary font-bold">{topThree[1].trees.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">trees</div>
                </div>
                <div className="mt-4 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-t from-slate-500/20 to-transparent rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-4xl md:text-5xl font-bold text-slate-400">2</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div
                    className={cn(
                      "w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br flex items-center justify-center text-3xl md:text-4xl font-bold border-2 shadow-[0_0_30px_rgba(245,158,11,0.4)]",
                      getPodiumColor(1)
                    )}
                  >
                    {topThree[0].avatar}
                  </div>
                  <div className="absolute -top-4 -right-2 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center animate-bounce-slow">
                    <Trophy className="h-5 w-5 text-amber-900" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold md:text-lg">{topThree[0].name}</div>
                  <div className="text-xs text-muted-foreground mb-1">{topThree[0].country}</div>
                  <div className="text-primary font-bold text-xl">{topThree[0].trees.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">trees</div>
                </div>
                <div className="mt-4 w-28 md:w-40 h-32 md:h-44 bg-gradient-to-t from-amber-500/20 to-transparent rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-5xl md:text-6xl font-bold text-amber-400">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl md:text-3xl font-bold border-2",
                    getPodiumColor(3)
                  )}>
                    {topThree[2].avatar}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center">
                    <Medal className="h-4 w-4 text-amber-200" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm md:text-base">{topThree[2].name}</div>
                  <div className="text-xs text-muted-foreground mb-1">{topThree[2].country}</div>
                  <div className="text-primary font-bold">{topThree[2].trees.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">trees</div>
                </div>
                <div className="mt-4 w-24 md:w-32 h-20 md:h-24 bg-gradient-to-t from-amber-700/20 to-transparent rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-4xl md:text-5xl font-bold text-amber-700">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contributors Table */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up [animation-delay:150ms]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold">All Contributors</h3>
                <p className="text-sm text-muted-foreground">Ranked by total trees planted</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Level Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="pl-9 pr-4 py-3 neumorphic-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Levels</option>
                    <option value="Legend">Legend</option>
                    <option value="Master">Master</option>
                    <option value="Expert">Expert</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-72 pl-11 pr-4 py-3 neumorphic-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Contributor</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Impact Level</th>
                    <th
                      className="text-left py-4 px-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                      onClick={() => toggleSort("trees")}
                    >
                      <span className="flex items-center gap-1">
                        Trees Planted
                        <ArrowUpDown className={cn("h-3 w-3", sortField === "trees" && "text-primary")} />
                      </span>
                    </th>
                    <th
                      className="text-left py-4 px-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                      onClick={() => toggleSort("streak")}
                    >
                      <span className="flex items-center gap-1">
                        Streak
                        <ArrowUpDown className={cn("h-3 w-3", sortField === "streak" && "text-primary")} />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {restOfLeaderboard.map((contributor) => (
                    <tr
                      key={contributor.id}
                      className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="text-lg font-bold text-muted-foreground">#{contributor.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center font-semibold text-sm">
                            {contributor.avatar}
                          </div>
                          <div>
                            <span className="font-medium block">{contributor.name}</span>
                            <span className="text-xs text-muted-foreground">{contributor.country}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border",
                          getLevelColor(contributor.level)
                        )}>
                          <Star className="h-3 w-3" />
                          {contributor.level}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <TreePine className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{contributor.trees.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Flame className="h-4 w-4" />
                          <span className="font-medium">{contributor.streak} days</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {restOfLeaderboard.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No contributors found matching your search.</p>
                <button
                  onClick={() => { setSearchQuery(""); setFilterLevel("all") }}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
