import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Store, Clock, Bell, Save } from "lucide-react";

export default function RestaurantSettingsPage() {
  return (
    <DashboardLayout portalType="restaurant">
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your restaurant profile and preferences
          </p>
        </div>

        {/* Restaurant Profile */}
        <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Restaurant Profile</h2>
              <p className="text-sm text-muted-foreground">Basic restaurant information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input id="restaurantName" defaultValue="Pizza Palace" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Input id="cuisine" defaultValue="Italian" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+1 234 567 8900" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="123 Food Street, Downtown" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue="Authentic Italian pizzas made with fresh ingredients and traditional recipes."
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="rounded-xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Clock className="h-5 w-5 text-info" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Operating Hours</h2>
              <p className="text-sm text-muted-foreground">Set your business hours</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Accept Orders</p>
                <p className="text-sm text-muted-foreground">Toggle to start/stop accepting orders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="openTime">Opening Time</Label>
                <Input id="openTime" type="time" defaultValue="10:00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="closeTime">Closing Time</Label>
                <Input id="closeTime" type="time" defaultValue="22:00" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prepTime">Average Preparation Time (minutes)</Label>
              <Input id="prepTime" type="number" defaultValue="20" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Bell className="h-5 w-5 text-success" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure order notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Order Sound Alerts</p>
                <p className="text-sm text-muted-foreground">Play sound for new orders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive daily order summaries</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">SMS Alerts</p>
                <p className="text-sm text-muted-foreground">Get SMS for high-value orders</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end animate-slide-up" style={{ animationDelay: "300ms" }}>
          <Button size="lg">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
