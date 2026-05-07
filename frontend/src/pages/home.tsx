import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListPlans } from "@workspace/api-client-react";
import { useState } from "react";
import {
  Server, Shield, Zap, Globe, Clock, HeadphonesIcon,
  Check, Monitor, Terminal, ArrowRight, Star, ChevronDown
} from "lucide-react";

const features = [
  { icon: Shield, title: "Enterprise Security", desc: "Isolated tenant environments with strict data separation and encrypted credentials vault." },
  { icon: Zap, title: "Instant Provisioning", desc: "Auto-assign servers from our pool and provision with custom credentials in seconds." },
  { icon: Globe, title: "Global Hostnames", desc: "Every server gets a unique subdomain hostname — never expose raw IPs." },
  { icon: Clock, title: "99.9% Uptime SLA", desc: "High-availability infrastructure with monitoring and automatic failover." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Dedicated support team with ticket management and fast response times." },
  { icon: Server, title: "Full Root Access", desc: "Complete administrative control over your Windows RDP or Ubuntu VPS." },
];

const ramOptions = [4, 8, 16, 32];

function PricingCard({ plan, isPopular }: { plan: { id: string; name: string; type: string; os: string; ram: number; cpu: number; storage: number; monthlyCost: number; features: string[]; popular?: boolean }; isPopular: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -8, rotateX: 2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl border p-6 flex flex-col gap-4 cursor-pointer ${
        isPopular
          ? "border-primary bg-primary/5 shadow-2xl shadow-primary/20"
          : "border-border bg-card shadow-lg hover:shadow-xl hover:shadow-primary/10"
      }`}
      style={{ perspective: "1000px" }}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
            <Star className="w-3 h-3 mr-1" /> Most Popular
          </Badge>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.type === "RDP" ? "bg-blue-500/10" : "bg-emerald-500/10"}`}>
          {plan.type === "RDP" ? (
            <Monitor className={`w-5 h-5 text-blue-500`} />
          ) : (
            <Terminal className={`w-5 h-5 text-emerald-500`} />
          )}
        </div>
        <div>
          <p className="font-bold text-sm">{plan.name}</p>
          <p className="text-xs text-muted-foreground">{plan.os}</p>
        </div>
      </div>

      <div>
        <span className="text-3xl font-bold">₹{plan.monthlyCost.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">/month</span>
      </div>

      <div className="text-xs text-muted-foreground flex gap-4">
        <span>{plan.ram}GB RAM</span>
        <span>{plan.cpu} vCPU</span>
        <span>{plan.storage}GB SSD</span>
      </div>

      <ul className="space-y-2 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs">
            <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link href="/register">
        <Button
          className={`w-full ${isPopular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90"} text-white`}
          data-testid={`button-deploy-${plan.id}`}
        >
          Deploy Now <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"RDP" | "VPS">("RDP");
  const { data: plans = [] } = useListPlans();

  const filteredPlans = plans.filter((p) => p.type === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 text-primary">
              <Zap className="w-3 h-3 mr-1" /> Enterprise Cloud Infrastructure
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            Cloud Servers Built for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Professionals
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            Deploy Windows RDP and Ubuntu Linux VPS servers in seconds. Full root access, custom hostnames, automated provisioning, and enterprise-grade security.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 shadow-xl shadow-primary/25" data-testid="button-get-started">
                Start Deploying <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="px-8">
                View Pricing <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[["99.9%", "Uptime SLA"], ["< 60s", "Deploy Time"], ["24/7", "Support"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-primary">{val}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">Why Choose Techofy Cloud</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Enterprise-grade features without enterprise complexity.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass rounded-xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-shadow"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">No hidden fees. Pay from your Techofy Wallet.</p>
          </motion.div>

          <div className="flex justify-center gap-2 mb-10">
            {(["RDP", "VPS"] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "bg-primary text-white" : ""}
                data-testid={`tab-${tab.toLowerCase()}`}
              >
                {tab === "RDP" ? <Monitor className="w-4 h-4 mr-2" /> : <Terminal className="w-4 h-4 mr-2" />}
                {tab === "RDP" ? "Windows RDP" : "Ubuntu VPS"}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: "2000px" }}>
            {filteredPlans.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <PricingCard plan={plan} isPopular={!!plan.popular} />
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Need custom specs?{" "}
            <Link href="/dashboard/deploy" className="text-primary hover:underline font-medium">
              Configure your own server
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            Ready to Deploy Your First Server?
          </motion.h2>
          <p className="text-white/80 mb-8">Create your account, fund your wallet, and deploy in under 2 minutes.</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8" data-testid="button-cta-register">
              Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm">Techofy Cloud</span>
              </div>
              <p className="text-xs text-muted-foreground">Professional cloud infrastructure for everyone.</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Products</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/register" className="hover:text-foreground">Windows RDP</Link></li>
                <li><Link href="/register" className="hover:text-foreground">Ubuntu VPS</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Company</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="/dashboard/support" className="hover:text-foreground">Support</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Legal</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
                <li><Link href="/refund" className="hover:text-foreground">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Techofy Cloud. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
