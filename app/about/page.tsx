"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Send,
  TreePine,
  Heart,
  Globe,
  Shield,
  CheckCircle2,
  Loader2,
  Clock,
  Users,
  Leaf,
  Award
} from "lucide-react"
import { Navigation } from "@/components/navigation"

const values = [
  {
    icon: Heart,
    title: "Passion for Nature",
    description: "Every tree planted is a step towards a healthier planet. We believe in the power of collective action."
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Connecting volunteers across 120+ countries to create measurable environmental change."
  },
  {
    icon: Shield,
    title: "Data Integrity",
    description: "Transparent tracking and verified metrics ensure every contribution is accurately recorded."
  }
]

const milestones = [
  { year: "2019", event: "TreeTracker founded in Bengaluru", icon: TreePine },
  { year: "2020", event: "First 10,000 trees tracked globally", icon: Leaf },
  { year: "2022", event: "Expanded to 50+ countries", icon: Globe },
  { year: "2024", event: "AI-powered monitoring introduced", icon: Award },
  { year: "2026", event: "2.4M+ trees tracked, 120+ countries", icon: Users },
]

const reasons = [
  "General Inquiry",
  "Partnership Opportunity",
  "Technical Support",
  "Volunteer Registration",
  "Media & Press",
  "Other"
]

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format"
    if (!formData.reason) errors.reason = "Please select a reason"
    if (!formData.message.trim()) errors.message = "Message is required"
    else if (formData.message.trim().length < 10) errors.message = "Message must be at least 10 characters"
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateForm()
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
    setFormData({ name: "", email: "", reason: "", message: "" })
    setFormErrors({})
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 md:pt-32 pb-32 md:pb-16">
        <div className="container mx-auto px-4">
          {/* Mission Section */}
          <div className="mb-16 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Mission Text */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                  <TreePine className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Our Mission</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-balance">
                  Empowering Communities to
                  <span className="text-primary"> Restore Our Planet</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-6 text-pretty">
                  TreeTracker was founded with a simple yet powerful vision: to create the world&apos;s
                  most comprehensive platform for tracking and measuring environmental impact through
                  tree planting initiatives.
                </p>

                <p className="text-muted-foreground mb-8 text-pretty">
                  Our AI-powered platform combines cutting-edge technology with community-driven
                  efforts, enabling individuals, organizations, and governments to make data-driven
                  decisions that maximize their positive impact on the environment.
                </p>

                <div className="flex flex-wrap gap-8">
                  <div>
                    <div className="text-3xl font-bold text-primary">2.4M+</div>
                    <div className="text-sm text-muted-foreground">Trees Tracked</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">120+</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-muted-foreground">Active Volunteers</div>
                  </div>
                </div>
              </div>

              {/* Mission Image */}
              <div className="relative animate-fade-in-up [animation-delay:100ms]">
                <div className="glass-card rounded-3xl overflow-hidden aspect-[4/3] relative">
                  <Image
                    src="/canopy.jpg"
                    alt="Lush green forest canopy from below"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Our Core Values</h2>
              <p className="text-muted-foreground">The principles that guide everything we do.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, i) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    className="glass-card rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform animate-fade-in-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Our Journey</h2>
              <p className="text-muted-foreground">From a small idea to a global movement.</p>
            </div>

            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, i) => {
                const Icon = milestone.icon
                return (
                  <div
                    key={milestone.year}
                    className="flex gap-6 mb-8 last:mb-0 animate-fade-in-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {i < milestones.length - 1 && (
                        <div className="w-px h-full bg-border/40 mt-2" />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className="text-xs uppercase tracking-wider text-primary font-mono mb-1">{milestone.year}</p>
                      <p className="text-foreground font-medium">{milestone.event}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="glass-card rounded-3xl p-6 md:p-10 animate-fade-in-up [animation-delay:200ms]">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Form Info */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Have questions, partnership ideas, or want to join our mission?
                  We&apos;d love to hear from you.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Global Headquarters</div>
                      <div className="text-sm text-muted-foreground">San Francisco, California</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Send className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Email Us</div>
                      <div className="text-sm text-muted-foreground">hello@treetracker.earth</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Response Time</div>
                      <div className="text-sm text-muted-foreground">Within 24-48 hours</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (formErrors.name) setFormErrors({ ...formErrors, name: "" })
                      }}
                      className={`w-full px-4 py-3 neumorphic-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${formErrors.name ? 'ring-2 ring-destructive/50' : ''}`}
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                    {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (formErrors.email) setFormErrors({ ...formErrors, email: "" })
                      }}
                      className={`w-full px-4 py-3 neumorphic-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${formErrors.email ? 'ring-2 ring-destructive/50' : ''}`}
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                    {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium mb-2">Reason for Contact</label>
                  <select
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => {
                      setFormData({ ...formData, reason: e.target.value })
                      if (formErrors.reason) setFormErrors({ ...formErrors, reason: "" })
                    }}
                    className={`w-full px-4 py-3 neumorphic-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer ${formErrors.reason ? 'ring-2 ring-destructive/50' : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a reason...</option>
                    {reasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                  {formErrors.reason && <p className="text-xs text-destructive mt-1">{formErrors.reason}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value })
                      if (formErrors.message) setFormErrors({ ...formErrors, message: "" })
                    }}
                    className={`w-full px-4 py-3 neumorphic-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${formErrors.message ? 'ring-2 ring-destructive/50' : ''}`}
                    placeholder="Tell us more about your inquiry..."
                    disabled={isSubmitting}
                  />
                  {formErrors.message && <p className="text-xs text-destructive mt-1">{formErrors.message}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{formData.message.length} characters</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 neon-glow disabled:opacity-70 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Message Sent Successfully!
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
