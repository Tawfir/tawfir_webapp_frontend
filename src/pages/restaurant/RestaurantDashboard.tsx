import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart, DollarSign, TrendingUp, Clock, Eye } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  items: string[];
  amount: string;
  status: "pending" | "preparing" | "ready" | "delivered";
  time: string;
}

const mockOrders: Order[] = [
  { id: "ORD-101", customer: "Ahmed Ali", items: ["Margherita Pizza", "Garlic Bread"], amount: "$45.00", status: "preparing", time: "5 min ago" },
  { id: "ORD-102", customer: "Sara Khan", items: ["Pepperoni Pizza"], amount: "$28.50", status: "pending", time: "8 min ago" },
  { id: "ORD-103", customer: "Mohammed Hassan", items: ["Hawaiian Pizza", "Cola"], amount: "$35.00", status: "ready", time: "15 min ago" },
  { id: "ORD-104", customer: "Fatima Noor", items: ["Veggie Supreme"], amount: "$32.00", status: "delivered", time: "25 min ago" },
];

const statusConfig = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  preparing: { label: "Preparing", className: "bg-primary/10 text-primary border-primary/20" },
  ready: { label: "Ready", className: "bg-success/10 text-success border-success/20" },
  delivered: { label: "Delivered", className: "bg-muted text-muted-foreground border-border" },
};

export default function RestaurantDashboard() {
  return (
    <DashboardLayout portalType="restaurant">
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome to Pizza Palace! Here's your daily overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard
              title="Today's Orders"
              value="48"
              change="+12 from yesterday"
              changeType="positive"
              icon={ShoppingCart}
              iconColor="text-primary"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <StatCard
              title="Today's Revenue"
              value="$1,847"
              change="+18% from yesterday"
              changeType="positive"
              icon={DollarSign}
              iconColor="text-success"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <StatCard
              title="Avg. Prep Time"
              value="18 min"
              change="-3 min improvement"
              changeType="positive"
              icon={Clock}
              iconColor="text-info"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <StatCard
              title="Monthly Growth"
              value="+24%"
              change="vs last month"
              changeType="positive"
              icon={TrendingUp}
              iconColor="text-warning"
            />
          </div>
        </div>

        {/* Live Orders */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Live Orders</h3>
                  <p className="text-sm text-muted-foreground">Real-time order tracking</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                  </span>
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </div>
              <div className="divide-y divide-border">
                {mockOrders.map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {order.customer.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{order.id}</p>
                            <span className="text-xs text-muted-foreground">• {order.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{order.items.join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-foreground">{order.amount}</span>
                        <Badge variant="outline" className={cn("font-medium", status.className)}>
                          {status.label}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="rounded-xl border border-border bg-card p-6 h-full">
              <h3 className="text-lg font-semibold text-foreground mb-4">Popular Items Today</h3>
              <div className="space-y-4">
                {[
                  { name: "Margherita Pizza", orders: 18, percentage: 85 },
                  { name: "Pepperoni Pizza", orders: 15, percentage: 70 },
                  { name: "Hawaiian Pizza", orders: 12, percentage: 55 },
                  { name: "Veggie Supreme", orders: 8, percentage: 38 },
                  { name: "BBQ Chicken", orders: 6, percentage: 28 },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.orders} orders</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
