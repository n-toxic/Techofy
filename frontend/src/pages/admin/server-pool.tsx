import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListServerPool, useAddServerToPool } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Database, PlusCircle, Monitor, Terminal, Server } from "lucide-react";

const schema = z.object({
  ip: z.string().min(7, "Invalid IP address"),
  rootUsername: z.string().min(1, "Root username required"),
  rootPassword: z.string().min(1, "Root password required"),
  type: z.enum(["RDP", "VPS"]),
  location: z.string().min(1, "Location required"),
});

type PoolServer = {
  id: string;
  ip: string;
  type: string;
  location: string;
  isAvailable: boolean;
  rootUsername: string;
  createdAt: string;
};

export default function AdminServerPool() {
  const { data: pool = [], isLoading, refetch } = useListServerPool();
  const { toast } = useToast();

  const addMut = useAddServerToPool({
    mutation: {
      onSuccess: () => {
        toast({ title: "Server added to pool" });
        refetch();
        form.reset();
      },
      onError: (err: { data?: { error?: string } }) => toast({ title: "Failed to add server", description: err?.data?.error, variant: "destructive" }),
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ip: "", rootUsername: "root", rootPassword: "", type: "VPS", location: "Mumbai" },
  });

  const available = (pool as PoolServer[]).filter((s) => s.isAvailable).length;
  const assigned = (pool as PoolServer[]).length - available;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">Server Pool</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage available physical servers for deployment.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Servers", value: (pool as PoolServer[]).length, color: "bg-primary" },
            { label: "Available", value: available, color: "bg-secondary" },
            { label: "Assigned", value: assigned, color: "bg-orange-500" },
          ].map(({ label, value, color }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                  <Server className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add server form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-primary" /> Add Server to Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => addMut.mutate({ data: v }))} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="type"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Server Type</FormLabel>
                          <div className="flex gap-2">
                            {(["VPS", "RDP"] as const).map((t) => (
                              <Button key={t} type="button"
                                variant={field.value === t ? "default" : "outline"}
                                className={field.value === t ? "bg-primary text-white" : ""}
                                onClick={() => field.onChange(t)}
                                data-testid={`button-type-${t.toLowerCase()}`}
                              >
                                {t === "RDP" ? <Monitor className="w-3.5 h-3.5 mr-1.5" /> : <Terminal className="w-3.5 h-3.5 mr-1.5" />}
                                {t === "RDP" ? "Windows RDP" : "Ubuntu VPS"}
                              </Button>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="ip"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>IP Address</FormLabel>
                          <FormControl><Input {...field} placeholder="192.168.1.100" data-testid="input-ip" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="rootUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Root Username</FormLabel>
                          <FormControl><Input {...field} placeholder="root" data-testid="input-root-username" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="rootPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Root Password</FormLabel>
                          <FormControl><Input {...field} type="password" placeholder="••••••••" data-testid="input-root-password" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="location"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Location / DC</FormLabel>
                          <FormControl><Input {...field} placeholder="Mumbai, IN" data-testid="input-location" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={addMut.isPending} data-testid="button-add-server">
                    {addMut.isPending ? "Adding..." : "Add Server"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Pool list */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current Pool</h3>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
            ) : (pool as PoolServer[]).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No servers in pool</p>
              </div>
            ) : (
              (pool as PoolServer[]).map((server, i) => (
                <motion.div key={server.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${server.type === "RDP" ? "bg-blue-500/10" : "bg-emerald-500/10"}`}>
                          {server.type === "RDP" ? <Monitor className="w-4 h-4 text-blue-500" /> : <Terminal className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-sm font-medium">{server.ip}</p>
                            <Badge variant="outline" className={`text-xs ${server.isAvailable ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}`}>
                              {server.isAvailable ? "Available" : "Assigned"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{server.type}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{server.location} · User: {server.rootUsername}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
