import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { ArrowUpRight, MapPin, Quote, Compass, Leaf, Users, Activity } from "lucide-react"

const features = [
  {
    icon: Compass,
    title: "Precise Mapping",
    body: "Every sapling pinned to ±2m GPS, with soil notes from the planter's own boots.",
    meta: "GIS-grade",
  },
  {
    icon: Leaf,
    title: "Carbon Metrics",
    body: "Per-tree CO₂ ledger, audited annually. We strike credits the moment a tree dies.",
    meta: "Gold Standard",
  },
  {
    icon: Users,
    title: "Community Led",
    body: "Volunteers, schools, and trusts — not contractors. Trees you log are yours.",
    meta: "120+ countries",
  },
  {
    icon: Activity,
    title: "Smart Monitoring",
    body: "Soil moisture and herbivore alerts straight to your inbox. No dashboards required.",
    meta: "Live signals",
  },
]

// Specific, real-feeling data — not round marketing numbers
const recentPlantings = [
  { id: "TT-08471", species: "Quercus robur", planter: "Maria Santos", location: "Serra da Estrela, PT", days: 3 },
  { id: "TT-08470", species: "Acer saccharum", planter: "Jonah Levi", location: "Vermont, US", days: 4 },
  { id: "TT-08469", species: "Tectona grandis", planter: "Priya Iyer", location: "Wayanad, IN", days: 5 },
  { id: "TT-08468", species: "Eucalyptus regnans", planter: "Beth O'Connor", location: "Tasmania, AU", days: 6 },
]

const stories = [
  {
    quote: "I started with one chestnut behind my mother's house in 2019. The app told me the soil pH was wrong. It's now eight meters tall.",
    author: "Tomás Ribeiro",
    role: "Volunteer · Portugal",
    trees: 312,
  },
  {
    quote: "We used to lose half our saplings to drought. The moisture alerts changed everything — last season we hit 89% survival.",
    author: "Dr. Amara Okafor",
    role: "Field Coordinator · Lagos Reforestation Trust",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* HERO — editorial, asymmetric */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span className="w-8 h-px bg-primary" />
                <span>Est. 2019 · A field journal</span>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance mb-6">
                Track every tree.
                <span className="block italic text-primary">Save every future.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-10">
                Not a campaign. Not a counter on a homepage. A working tool for the people 
                who actually plant — foresters in Kerala, retirees in Maine, schoolkids in 
                Nairobi. They log every sapling. We help it survive.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition"
                >
                  Start Planting
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-border rounded-full font-medium text-sm hover:bg-secondary/50 transition"
                >
                  View Dashboard
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src="/forest-hero.jpg"
                  alt="Misty forest at dawn"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background border border-border/60 px-4 py-3 max-w-[220px] shadow-xl">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Field note 04.12</p>
                <p className="text-sm leading-snug">Cork oak grove, north slope. 41 saplings, all leafing out.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER — recent, specific activity */}
      <section className="border-y border-border/40 py-5 overflow-hidden">
        <div className="flex items-center gap-12 whitespace-nowrap text-sm text-muted-foreground animate-[scroll_40s_linear_infinite]">
          {[...recentPlantings, ...recentPlantings, ...recentPlantings].map((p, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <span className="text-primary font-mono text-xs">{p.id}</span>
              <span className="font-serif italic">{p.species}</span>
              <span className="text-muted-foreground/60">·</span>
              <span>{p.planter}</span>
              <span className="text-muted-foreground/60">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {p.location}
              </span>
              <span className="text-muted-foreground/60">·</span>
              <span className="text-xs">{p.days}d ago</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES — glassmorphism 4-col grid */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">— What we actually do</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance max-w-2xl">
                Four tools, built by foresters, <span className="italic text-primary">not marketers.</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Each one solves a problem we kept hitting in the field. Nothing more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="glass-card rounded-2xl p-7 flex flex-col hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      0{i + 1} / {f.meta}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl mb-3">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* MANIFESTO — long-form, human */}
      <section className="py-28 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">— A note from the team</p>
          <p className="font-serif text-3xl md:text-4xl leading-[1.3] text-balance mb-10">
            Most of the world&apos;s &quot;billion tree&quot; promises died in their first 
            summer. Nobody watered them. Nobody checked. We built TreeTracker because 
            <span className="italic text-primary"> a tree planted is not a tree saved</span> — 
            it&apos;s a tree that needs five years of attention.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="w-10 h-10 rounded-full bg-secondary border border-border/60 flex items-center justify-center text-xs font-medium text-foreground">
              RK
            </div>
            <div>
              <p className="text-foreground">Ravi Krishnan</p>
              <p>Co-founder · Bengaluru</p>
            </div>
          </div>
        </div>
      </section>

      {/* TWO-UP IMAGE + COPY — magazine layout */}
      <section className="px-6 lg:px-12 pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/sapling-detail.jpg" alt="Young sapling pushing through soil" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" />
          </div>
          <div className="bg-secondary/30 p-10 md:p-14 flex flex-col justify-between aspect-[4/3]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">01 / Survival, not vanity</p>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight mb-4 text-balance">
                The first 1,000 days are everything.
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Soil moisture, herbivore pressure, root collar depth. The difference between 
                a forest and a graveyard of sticks is rarely the planting day — it&apos;s the 
                Tuesday in August three years later.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border/40">
              <div>
                <p className="font-serif text-3xl text-primary">87.4%</p>
                <p className="text-xs text-muted-foreground mt-1">Survival across our network</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-primary">3.2×</p>
                <p className="text-xs text-muted-foreground mt-1">Better than industry average</p>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 p-10 md:p-14 flex flex-col justify-between aspect-[4/3] order-4 md:order-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">02 / Honest carbon</p>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight mb-4 text-balance">
                We don&apos;t sell offsets we can&apos;t verify.
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Every tonne of CO₂ in our ledger is tied to a specific tree, species, and 
                year. If a tree dies, we strike the credit. It&apos;s slower. It&apos;s also 
                true.
              </p>
            </div>
            <p className="font-mono text-xs text-muted-foreground pt-8 border-t border-border/40">
              Verified by Gold Standard · Audited Q1 2026
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden order-3 md:order-4">
            <Image src="/canopy.jpg" alt="Forest canopy from below" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL — featured */}
      <section className="px-6 lg:px-12 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/planter-maria.jpg" alt="A volunteer planting an oak" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" />
            </div>
            <div>
              <Quote className="h-10 w-10 text-primary mb-6" strokeWidth={1} />
              <p className="font-serif text-2xl md:text-3xl leading-[1.4] mb-8 text-balance">
                &quot;{stories[0].quote}&quot;
              </p>
              <div className="flex items-center justify-between border-t border-border/40 pt-6">
                <div>
                  <p className="font-medium">{stories[0].author}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stories[0].role}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-primary">{stories[0].trees}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">trees logged</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECONDARY STORY — pulled quote */}
      <section className="px-6 lg:px-12 pb-28">
        <div className="max-w-4xl mx-auto border-l-2 border-primary/40 pl-8 md:pl-12 py-4">
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-muted-foreground italic mb-6">
            &quot;{stories[1].quote}&quot;
          </p>
          <p className="text-sm">
            <span className="text-foreground">{stories[1].author}</span>
            <span className="text-muted-foreground"> — {stories[1].role}</span>
          </p>
        </div>
      </section>

      {/* CLOSING */}
      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">Join the field</p>
          <h2 className="font-serif text-5xl md:text-7xl leading-[1] text-balance mb-10">
            The next tree on the map <span className="italic text-primary">could be yours.</span>
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition"
          >
            Create your plot
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <p className="mt-8 text-xs text-muted-foreground">
            Free for individuals and schools. We charge organizations on a sliding scale.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg text-foreground">TreeTracker</span>
            <span>·</span>
            <span>A small team in Bengaluru, Lisbon, and Vermont</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-foreground transition">About</Link>
            <Link href="/dashboard" className="hover:text-foreground transition">Data</Link>
            <Link href="/leaderboard" className="hover:text-foreground transition">Field journal</Link>
            <span className="font-mono text-xs">v3.2.1</span>
          </div>
        </div>
      </footer>

      <div className="h-24 md:h-0" />

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}
