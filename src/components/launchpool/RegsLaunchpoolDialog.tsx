import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Sparkles } from "lucide-react";

interface RegsLaunchpoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RegsLaunchpoolDialog({ open, onOpenChange }: RegsLaunchpoolDialogProps) {
  const [notify, setNotify] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Launchpool</DialogTitle>
          <DialogDescription>
            Receive REGS airdrops at no extra cost.
          </DialogDescription>
        </DialogHeader>

        <Card className="border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2"><Sparkles className="h-5 w-5" /></div>
              <div className="space-y-1">
                <p className="text-base font-semibold">New projects coming soon. Stay tuned!</p>
                <p className="text-sm text-muted-foreground">Subscribe to REGS Simple Earn</p>
                <p className="text-xs text-muted-foreground">Get <span className="text-emerald-600 dark:text-emerald-400 font-medium">0.14% APR</span> and auto-join each Launchpool!</p>
                <div className="pt-2">
                  <Button className="w-full">Subscribe</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Turn on Notifications</p>
              <p className="text-xs text-muted-foreground">Get notified when new Launchpool projects arrive</p>
            </div>
            <div className="inline-flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Switch checked={notify} onCheckedChange={setNotify} aria-label="Toggle Launchpool notifications" />
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        <section>
          <div className="mb-2 text-sm font-medium">Completed Projects</div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">REGS Stakers Drop</p>
                    <Badge variant="secondary">Distributed</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">1,000,000 REGS</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">2025</span>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
