import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { Store, ShoppingCart, Users, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard
              title="Total Restaurants"
              value="124"
              change="+12 this month"
              changeType="positive"
              icon={Store}
              iconColor="text-primary"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <StatCard
              title="Total Orders"
              value="1,847"
              change="+23% from last week"
              changeType="positive"
              icon={ShoppingCart}
              iconColor="text-info"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <StatCard
              title="Active Users"
              value="3,421"
              change="+156 new users"
              changeType="positive"
              icon={Users}
              iconColor="text-success"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <StatCard
              title="Revenue"
              value="$48,295"
              change="+18.5% from last month"
              changeType="positive"
              icon={DollarSign}
              iconColor="text-warning"
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
                  <p className="text-sm text-muted-foreground">Monthly revenue trends</p>
                </div>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div className="flex h-64 items-center justify-center rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">Revenue chart will be displayed here</p>
              </div>
            </div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="rounded-xl border border-border bg-card p-6 h-full">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Restaurants</h3>
              <div className="space-y-4">
                {[
                  { name: "Pizza Palace", orders: 234, revenue: "$12,450" },
                  { name: "Burger Hub", orders: 189, revenue: "$9,876" },
                  { name: "Sushi Express", orders: 156, revenue: "$8,234" },
                  { name: "Taco Town", orders: 134, revenue: "$6,789" },
                ].map((restaurant, index) => (
                  <div
                    key={restaurant.name}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{restaurant.name}</p>
                        <p className="text-xs text-muted-foreground">{restaurant.orders} orders</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{restaurant.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="animate-slide-up" style={{ animationDelay: "600ms" }}>
          <RecentOrdersTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
