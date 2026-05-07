import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetWallet, useListTransactions, useCreateDeposit, useVerifyDeposit } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, Plus, CheckCircle } from "lucide-react";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

declare global { interface Window { Razorpay: new (opts: Record<string, unknown>) => { open(): void }; } }

export default function Billing() {
  const { data: wallet, isLoading: walletLoading, refetch: refetchWallet } = useGetWallet();
  const { data: transactions = [], isLoading: txLoading } = useListTransactions();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const createDepositMut = useCreateDeposit({ mutation: { onError: (err: { data?: { error?: string } }) => { toast({ title: "Failed to create order", description: err?.data?.error, variant: "destructive" }); setLoading(false); } } });
  const verifyMut = useVerifyDeposit({ mutation: { onSuccess: () => { toast({ title: "Payment successful!", description: "Your wallet has been topped up." }); refetchWallet(); setLoading(false); }, onError: () => { toast({ title: "Payment verification failed", variant: "destructive" }); setLoading(false); } } });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleDeposit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 100) { toast({ title: "Minimum deposit is ₹100", variant: "destructive" }); return; }
    setLoading(true);
    createDepositMut.mutate({ data: { amount: amt } }, {
      onSuccess: (order) => {
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Techofy Cloud",
          description: "Wallet Top-up",
          order_id: order.orderId,
          handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            verifyMut.mutate({ data: { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature } });
          },
          modal: { ondismiss: () => setLoading(false) },
        });
        rzp.open();
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Billing & Wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your Techofy Wallet and view transaction history.</p>
        </div>

        {/* Wallet balance */}
        <motion.div whileHover={{ y: -2 }}>
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0 overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-10 -translate-x-8" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 opacity-80" />
                  <span className="text-sm font-medium opacity-80">Techofy Wallet</span>
                </div>
                {walletLoading ? (
                  <Skeleton className="h-10 w-40 bg-white/20" />
                ) : (
                  <p className="text-4xl font-bold">₹{wallet?.balance.toFixed(2) ?? "0.00"}</p>
                )}
                <p className="text-sm opacity-70 mt-1">Available balance</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add funds */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Add Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((amt) => (
                <Button key={amt} variant={amount === String(amt) ? "default" : "outline"}
                  className={amount === String(amt) ? "bg-primary text-white" : ""}
                  onClick={() => setAmount(String(amt))}
                  data-testid={`button-preset-${amt}`}
                >
                  ₹{amt}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">₹</span>
                <Input
                  type="number" min="100" placeholder="Custom amount"
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  data-testid="input-amount"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white px-6"
                onClick={handleDeposit} disabled={loading || !amount}
                data-testid="button-pay"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {loading ? "Processing..." : "Pay via Razorpay"}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-secondary" />
              Secured by Razorpay · Supports UPI, Cards, Net Banking
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === "CREDIT" ? "bg-secondary/10" : "bg-destructive/10"}`}>
                      {tx.type === "CREDIT" ? <ArrowDownLeft className="w-4 h-4 text-secondary" /> : <ArrowUpRight className="w-4 h-4 text-destructive" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${tx.type === "CREDIT" ? "text-secondary" : "text-destructive"}`}>
                        {tx.type === "CREDIT" ? "+" : "-"}₹{Math.abs(tx.amount).toFixed(2)}
                      </p>
                      <Badge variant="outline" className={`text-xs ${tx.status === "COMPLETED" ? "text-secondary border-secondary/20" : "text-orange-600 border-orange-500/20"}`}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
