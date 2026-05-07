import { motion } from "framer-motion";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListTickets, useCreateTicket } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { HelpCircle, PlusCircle, MessageCircle, Clock, CheckCircle, ExternalLink } from "lucide-react";

const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string; icon: React.ElementType }> = {
    OPEN: { label: "Open", class: "bg-primary/10 text-primary border-primary/20", icon: MessageCircle },
    IN_PROGRESS: { label: "In Progress", class: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: Clock },
    CLOSED: { label: "Closed", class: "bg-muted text-muted-foreground border-border", icon: CheckCircle },
  };
  const s = map[status] ?? { label: status, class: "bg-muted text-muted-foreground border-border", icon: HelpCircle };
  const Icon = s.icon;
  return (
    <Badge variant="outline" className={`text-xs flex items-center gap-1 ${s.class}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </Badge>
  );
}

export default function Support() {
  const { data: tickets = [], isLoading, refetch } = useListTickets();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const createMut = useCreateTicket({
    mutation: {
      onSuccess: () => { toast({ title: "Ticket submitted!", description: "We'll get back to you shortly." }); refetch(); setOpen(false); form.reset(); },
      onError: () => toast({ title: "Failed to create ticket", variant: "destructive" }),
    },
  });

  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { subject: "", message: "" },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Support Center</h1>
            <p className="text-sm text-muted-foreground mt-1">{tickets.length} ticket{tickets.length !== 1 ? "s" : ""} total</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white" data-testid="button-new-ticket">
                <PlusCircle className="w-4 h-4 mr-2" /> New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Open a Support Ticket</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => createMut.mutate({ data: v }))} className="space-y-4">
                  <FormField control={form.control} name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl><Input {...field} placeholder="Brief description of your issue" data-testid="input-subject" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your issue in detail..." rows={5} data-testid="input-message" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={createMut.isPending} data-testid="button-submit-ticket">
                    {createMut.isPending ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="font-semibold mb-2">No tickets yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Got an issue? Our support team is ready to help.</p>
              <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setOpen(true)} data-testid="button-create-first-ticket">
                <PlusCircle className="w-4 h-4 mr-2" /> Create First Ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket, i) => (
              <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-md hover:shadow-primary/5 transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <HelpCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{ticket.subject}</p>
                          <StatusBadge status={ticket.status} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Opened {new Date(ticket.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <Link href={`/dashboard/support/${ticket.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs shrink-0" data-testid={`button-view-ticket-${ticket.id}`}>
                          <ExternalLink className="w-3 h-3 mr-1" /> View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
