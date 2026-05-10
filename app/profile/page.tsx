"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import {
  TreePine,
  Camera,
  Edit2,
  MapPin,
  Calendar,
  Leaf,
  Award,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Check,
  Bell,
  Shield,
  Palette,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Trees Planted", value: "127", icon: TreePine, trend: "+12 this month" },
  { label: "CO2 Offset", value: "2.4t", icon: Leaf, trend: "+0.3t this month" },
  { label: "Badges Earned", value: "8", icon: Award, trend: "2 new" },
]

const achievements = [
  { name: "First Tree", description: "Plant your first tree", earned: true, icon: "🌱" },
  { name: "Century Club", description: "Plant 100 trees", earned: true, icon: "💯" },
  { name: "Carbon Fighter", description: "Offset 1 ton of CO2", earned: true, icon: "🌍" },
  { name: "Community Leader", description: "Refer 10 friends", earned: false, icon: "👥" },
  { name: "Forest Guardian", description: "Plant 500 trees", earned: false, icon: "🏆" },
  { name: "Eco Warrior", description: "Offset 10 tons of CO2", earned: false, icon: "⚡" },
]

const recentActivity = [
  { action: "Planted 3 Oak Trees", location: "Central Park", date: "2 hours ago" },
  { action: "Earned Carbon Fighter Badge", location: "", date: "Yesterday" },
  { action: "Planted 5 Maple Trees", location: "Riverside", date: "3 days ago" },
  { action: "Joined Community Event", location: "Green Initiative", date: "1 week ago" },
]

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("Sarah Johnson")
  const [bio, setBio] = useState("Environmental enthusiast. Making the world greener, one tree at a time.")
  const [location, setLocation] = useState("San Francisco, CA")
  const [showSettings, setShowSettings] = useState(false)
  const [showBadges, setShowBadges] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [savedMessage, setSavedMessage] = useState("")

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const userData = localStorage.getItem("treetracker_user")
      if (userData) {
        const parsed = JSON.parse(userData)
        if (parsed.name) setName(parsed.name)
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Persist to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("treetracker_user") || "{}")
      localStorage.setItem("treetracker_user", JSON.stringify({
        ...existing,
        name,
        bio,
        location,
      }))
    } catch {
      // Ignore
    }
    setSavedMessage("Profile saved successfully!")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  const handleSignOut = () => {
    localStorage.removeItem("treetracker_user")
    router.push("/login")
  }

  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen pb-32 md:pb-8">
      <Navigation />

      {/* Success Message Toast */}
      {savedMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="glass-card rounded-xl px-6 py-3 flex items-center gap-3">
            <Check className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium">{savedMessage}</span>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="pt-24 md:pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Cover & Avatar */}
          <div className="relative">
            <div className="h-48 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-secondary overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            </div>

            <div className="absolute -bottom-16 left-8 flex items-end gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-secondary border-4 border-background overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-primary-foreground">
                    {initials}
                  </div>
                </div>
                <button
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => alert("Profile photo upload would be available in a production environment.")}
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="glass border-border/50 hover:bg-secondary/50"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-20 px-4">
            {isEditing ? (
              <div className="space-y-4 max-w-md animate-fade-in">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 bg-secondary/50 border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 bg-secondary/50 border-border/50"
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  className="bg-primary text-primary-foreground"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-foreground">{name}</h1>
                <p className="mt-2 text-muted-foreground max-w-lg">{bio}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined March 2024
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <TrendingUp className="h-4 w-4" />
                    Top 5% Contributor
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 px-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-xs text-primary mt-1">{stat.trend}</p>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Achievements */}
          <div className="mt-8 px-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={cn(
                    "glass-card rounded-2xl p-4 text-center transition-all cursor-pointer",
                    achievement.earned
                      ? "hover:scale-[1.02]"
                      : "opacity-50 grayscale"
                  )}
                  onClick={() => {
                    if (achievement.earned) {
                      alert(`🎉 ${achievement.name}\n\n${achievement.description}\n\nYou earned this badge!`)
                    } else {
                      alert(`🔒 ${achievement.name}\n\n${achievement.description}\n\nKeep planting to unlock this badge!`)
                    }
                  }}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold text-foreground text-sm">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  {achievement.earned && (
                    <span className="inline-block mt-2 text-xs text-primary font-medium">Earned</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 px-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="glass-card rounded-2xl divide-y divide-border/30">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    {activity.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {activity.location}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 px-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="glass-card rounded-2xl divide-y divide-border/30">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">Account Settings</span>
                </div>
                <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform", showSettings && "rotate-90")} />
              </button>

              {/* Inline Settings Panel */}
              {showSettings && (
                <div className="p-4 space-y-4 animate-fade-in bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Push Notifications</p>
                        <p className="text-xs text-muted-foreground">Get alerts for tree health and events</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={cn(
                        "w-12 h-7 rounded-full transition-colors relative",
                        notifications ? "bg-primary" : "bg-secondary"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform",
                        notifications ? "translate-x-5" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Two-Factor Auth</p>
                        <p className="text-xs text-muted-foreground">Extra security for your account</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Theme</p>
                        <p className="text-xs text-muted-foreground">Dark Forest (default)</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Default</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowBadges(!showBadges)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">View All Badges</span>
                </div>
                <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform", showBadges && "rotate-90")} />
              </button>

              {/* Inline Badges Panel */}
              {showBadges && (
                <div className="p-4 animate-fade-in bg-secondary/10">
                  <div className="grid grid-cols-3 gap-3">
                    {achievements.map((a, i) => (
                      <div key={i} className={cn(
                        "text-center p-3 rounded-xl",
                        a.earned ? "bg-primary/10" : "bg-secondary/30 opacity-50"
                      )}>
                        <div className="text-2xl mb-1">{a.icon}</div>
                        <p className="text-xs font-medium text-foreground">{a.name}</p>
                        <p className="text-[10px] text-muted-foreground">{a.earned ? "✅ Earned" : "🔒 Locked"}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    {achievements.filter(a => a.earned).length} of {achievements.length} badges earned
                  </p>
                </div>
              )}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 text-destructive transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
