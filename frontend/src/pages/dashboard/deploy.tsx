import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListPlans, useDeployInstance, useGetWallet } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Monitor, Terminal, Check, AlertCircle, Rocket, Star, CreditCard } from "lucide-react";

export default function Deploy() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: plans = [], isLoading } = useListPlans();
  const { data: wallet } = useGetWallet();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [osTab, setOsTab] = useState<"RDP" | "VPS">("RDP");

  const deployMut = useDeployInstance({
    mutation: {
      onSuccess: () => {
        toast({ title: "Server deploying!", description: "Your server will be ready in a few moments." });
        setLocation("/dashboard/instances");
      },
      onError: (err: { data?: { error?: string }; message?: string }) => {
        toast({ title: "Deployment failed", description: err?.data?.error ?? err?.message ?? "Insufficient balance or no server available.", variant: "destructive" });
      },
    },
  });

  const filteredPlans = plans.filter((p) => p.type === osTab);
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  const hasEnoughBalance = wallet && selectedPlan ? wallet.balance >= selectedPlan.monthlyCost : true;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Deploy a Server</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose your plan and deploy instantly from our server pool.</p>
        </div>

        {/* OS Tab */}
        <div className="flex gap-2">
          {(["RDP", "VPS"] as const).map((tab) => (
            <Button key={tab}
              variant={osTab === tab ? "default" : "outline"}
              onClick={() => { setOsTab(tab); setSelectedPlanId(null); }}
              className={osTab === tab ? "bg-primary text-white" : ""}
              data-testid={`tab-${tab.toLowerCase()}`}
            >
              {tab === "RDP" ? <Monitor className="w-4 h-4 mr-2" /> : <Terminal className="w-4 h-4 mr-2" />}
              {tab === "RDP" ? "Windows RDP" : "Ubuntu VPS"}
            </Button>
          ))}
        </div>

        {/* Plan selection */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Select a Plan</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No plans available for this server type.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredPlans.map((plan, i) => {
                const selected = selectedPlanId === plan.id;
                const affordable = wallet ? wallet.balance >= plan.monthlyCost : true;
                return (
                  <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <div
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
                        selected
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/15"
                          : "border-border bg-card hover:border-primary/40 hover:shadow-md"
                      } ${!affordable ? "opacity-60" : ""}`}
                      data-testid={`plan-${plan.id}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2 left-3">
                          <Badge className="bg-primary text-white text-xs px-2 py-0.5">
                            <Star className="w-2.5 h-2.5 mr-0.5" /> Popular
                          </Badge>
                        </div>
                      )}
                      {selected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      <div className="mt-1">
                        <p className="font-semibold text-sm">{plan.name}</p>
                        <p className="text-xs text-muted-foreground mb-3">{plan.os}</p>

                        <div className="mb-3">
                          <span className="text-2xl font-bold">₹{plan.monthlyCost.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">/mo</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground mb-3">
                          <Badge variant="outline" className="text-xs">{plan.ram}GB RAM</Badge>
                          <Badge variant="outline" className="text-xs">{plan.cpu} vCPU</Badge>
                          <Badge variant="outline" className="text-xs">{plan.storage}GB SSD</Badge>
                        </div>

                        <ul className="space-y-1">
                          {plan.features.slice(0, 3).map((f) => (
                            <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Check className="w-3 h-3 text-secondary shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Deploy section */}
        <AnimatePresence>
          {selectedPlan && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-primary" /> Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <div>
                      <p className="font-medium">{selectedPlan.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedPlan.ram}GB RAM · {selectedPlan.cpu} vCPU · {selectedPlan.storage}GB SSD</p>
                    </div>
                    <p className="font-bold text-lg text-primary">₹{selectedPlan.monthlyCost.toLocaleString()}</p>
                  </div>

                  {wallet && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Wallet Balance</span>
                      <span className={`font-medium ${hasEnoughBalance ? "text-secondary" : "text-destructive"}`}>
                        ₹{wallet.balance.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {!hasEnoughBalance && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Insufficient balance. Please add ₹{((selectedPlan.monthlyCost - (wallet?.balance ?? 0)).toFixed(2))} more.
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!hasEnoughBalance ? (
                      <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-white">
                        <a href="/dashboard/billing" data-testid="button-add-funds">
                          <CreditCard className="w-4 h-4 mr-2" /> Add Funds
                        </a>
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        disabled={deployMut.isPending}
                        onClick={() => deployMut.mutate({ data: { planId: selectedPlanId! } })}
                        data-testid="button-deploy-confirm"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        {deployMut.isPending ? "Deploying..." : "Deploy Now · ₹" + selectedPlan.monthlyCost.toLocaleString()}
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setSelectedPlanId(null)} data-testid="button-cancel">Cancel</Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    ₹{selectedPlan.monthlyCost.toLocaleString()} will be deducted from your wallet immediately. Servers deploy within 60 seconds.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
