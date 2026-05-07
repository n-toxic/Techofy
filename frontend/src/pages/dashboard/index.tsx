import { motion } from "framer-motion";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, CreditCard, HelpCircle, PlusCircle, Activity, TrendingUp, Clock } from "lucide-react";

function StatCard({ title, value, icon: Icon, color, sub }: { title: string; value: string | number; icon: React.ElementType; color: string; sub?: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useGetDashboardSummary();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name ?? user?.email?.split("@")[0]}!</h1>
            <p className="text-muted-foreground text-sm mt-1">Here's an overview of your cloud infrastructure.</p>
          </div>
          <Link href="/dashboard/deploy">
            <Button className="bg-primary hover:bg-primary/90 text-white" data-testid="button-deploy">
              <PlusCircle className="w-4 h-4 mr-2" /> Deploy Server
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Running Servers" value={summary?.runningInstances ?? 0} icon={Server} color="bg-primary" sub="Active instances" />
            <StatCard title="Wallet Balance" value={`₹${(summary?.walletBalance ?? 0).toFixed(2)}`} icon={CreditCard} color="bg-secondary" sub="Available funds" />
            <StatCard title="Monthly Spend" value={`₹${(summary?.monthlySpend ?? 0).toFixed(2)}`} icon={TrendingUp} color="bg-orange-500" sub="This month" />
            <StatCard title="Open Tickets" value={summary?.openTickets ?? 0} icon={HelpCircle} color="bg-purple-500" sub="Support requests" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { href: "/dashboard/deploy", label: "Deploy Server", icon: PlusCircle, color: "bg-primary/10 text-primary hover:bg-primary/20" },
                { href: "/dashboard/instances", label: "My Servers", icon: Server, color: "bg-secondary/10 text-secondary hover:bg-secondary/20" },
                { href: "/dashboard/billing", label: "Add Funds", icon: CreditCard, color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20" },
                { href: "/dashboard/support", label: "Get Support", icon: HelpCircle, color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20" },
              ].map(({ href, label, icon: Icon, color }) => (
                <Link key={href} href={href}>
                  <div className={`flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-colors ${color}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium text-center">{label}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {false ? (
                <div className="space-y-3" />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No transactions yet</p>
                  <Link href="/dashboard/billing">
                    <Button variant="link" size="sm" className="mt-2 text-primary">Add funds to get started</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status banner for low balance */}
        {summary && summary.walletBalance < 500 && summary.totalInstances > 0 && (
          <motion.div
            className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          >
            <CreditCard className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Low wallet balance</p>
              <p className="text-xs text-muted-foreground">Add funds to keep your servers running without interruption.</p>
            </div>
            <Link href="/dashboard/billing">
              <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-600 hover:bg-orange-500/10" data-testid="button-add-funds">Add Funds</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
