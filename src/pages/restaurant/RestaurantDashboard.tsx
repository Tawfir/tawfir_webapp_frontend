import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line, LineChart } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ShoppingBag, DollarSign, TrendingUp, Eye, Globe, ChevronDown } from "lucide-react";
import { restaurantApi } from "@/services/api";
import { toast } from "sonner";

interface Order {
  id: number;
  user?: { name: string };
  items?: Array<{ dish: { name: string } }>;
  total_price: number;
  status: "incoming" | "ready" | "completed";
  created_at: string;
  pickup_time: string;
}

const statusConfig = {
  incoming: { 
    label: "INCOMING", 
    className: "bg-primary/70 text-primary-foreground border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
  ready: { 
    label: "READY", 
    className: "bg-primary text-primary-foreground border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
  completed: { 
    label: "COMPLETED", 
    className: "bg-primary text-primary-foreground border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
};

// Generate chart data for last 30 days
const generateChartData = (type: "co2" | "orders") => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    
    if (type === "co2") {
      const value = i < 3 ? (89.5 / 3) * (3 - i) : Math.random() * 10;
      data.push({ date: `${month} ${day}`, value: parseFloat(value.toFixed(2)) });
    } else {
      const value = Math.floor(Math.random() * 15) + (i < 3 ? 5 : 0);
      data.push({ date: `${month} ${day}`, value });
    }
  }
  return data;
};

// Today's order status data
const todayOrderStatusData = [
  { status: "Incoming", count: 12 },
  { status: "Ready", count: 8 },
  { status: "Completed", count: 28 },
];

export default function RestaurantDashboard() {
  const [chartType, setChartType] = useState<"co2" | "orders">("co2");
  const [stats, setStats] = useState({
    totalSurplusItems: 0,
    surplusUtilization: 0,
    revenueFromSurplus: 0,
    netEarnings: 0,
    totalCO2Saved: 0,
  });
  const [incomingOrders, setIncomingOrders] = useState<Order[]>([]);
  const [todayOrderStatusData, setTodayOrderStatusData] = useState([
    { status: "Incoming", count: 0 },
    { status: "Ready", count: 0 },
    { status: "Completed", count: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const chartData = generateChartData(chartType);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dishes for surplus items count
      const dishesResponse = await restaurantApi.getDishes();
      const dishes = dishesResponse.status ? dishesResponse.data.dishes : [];
      const totalSurplusItems = dishes.reduce((sum: number, dish: any) => sum + (dish.quantity || 0), 0);

      // Fetch orders
      const ordersResponse = await restaurantApi.getOrders();
      const allOrders = ordersResponse.status ? ordersResponse.data.orders : [];
      
      // Filter today's orders
      const today = new Date().toDateString();
      const todayOrders = allOrders.filter((order: Order) => {
        const orderDate = new Date(order.created_at).toDateString();
        return orderDate === today && order.status !== "cancelled";
      });

      // Get incoming orders (today only)
      const incoming = todayOrders.filter((o: Order) => o.status === "incoming").slice(0, 10);

      // Calculate stats from completed orders
      const completedOrders = allOrders.filter((o: Order) => o.status === "completed");
      const revenueFromSurplus = completedOrders.reduce((sum: number, o: Order) => sum + (o.total_price || 0), 0);
      const netEarnings = revenueFromSurplus * 0.925; // After 7.5% service fee
      
      // Calculate CO2 saved from completed orders
      const totalCO2Saved = completedOrders.reduce((sum: number, order: Order) => {
        const orderCO2 = order.items?.reduce((itemSum: number, item: any) => {
          const dish = item.dish;
          return itemSum + ((dish?.co2_saved || 0) * item.quantity);
        }, 0) || 0;
        return sum + orderCO2;
      }, 0);

      // Calculate surplus utilization
      const totalItemsGiven = completedOrders.reduce((sum: number, order: Order) => {
        return sum + (order.items?.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0) || 0);
      }, 0);
      const surplusUtilization = totalSurplusItems > 0 
        ? Math.round((totalItemsGiven / (totalSurplusItems + totalItemsGiven)) * 100)
        : 0;

      // Today's order status counts
      const incomingCount = todayOrders.filter((o: Order) => o.status === "incoming").length;
      const readyCount = todayOrders.filter((o: Order) => o.status === "ready").length;
      const completedCount = todayOrders.filter((o: Order) => o.status === "completed").length;

      setStats({
        totalSurplusItems,
        surplusUtilization,
        revenueFromSurplus,
        netEarnings,
        totalCO2Saved,
      });

      setIncomingOrders(incoming);
      setTodayOrderStatusData([
        { status: "Incoming", count: incomingCount },
        { status: "Ready", count: readyCount },
        { status: "Completed", count: completedCount },
      ]);
    } catch (error: any) {
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    value: {
      label: chartType === "co2" ? "CO₂ Saved (KG)" : "Orders",
      color: chartType === "co2" ? "hsl(145, 65%, 32%)" : "hsl(185, 65%, 47%)",
    },
  };

  const barChartConfig = {
    count: {
      label: "Orders",
      color: "hsl(145, 65%, 32%)",
    },
  };

  return (
    <DashboardLayout portalType="restaurant">
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here's your daily overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard
              title="Total Surplus Items"
              value={`${stats.totalSurplusItems} items`}
              change="Currently available"
              changeType="neutral"
              icon={ShoppingBag}
              iconColor="text-success"
              className="h-full min-h-[140px]"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <StatCard
              title="Surplus Utilization"
              value={`${stats.surplusUtilization}%`}
              change="Items given away"
              changeType="positive"
              icon={TrendingUp}
              iconColor="text-primary"
              className="h-full min-h-[140px]"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <StatCard
              title="Surplus Earnings"
              value={`$${stats.revenueFromSurplus.toFixed(2)}`}
              change="Total earnings"
              changeType="positive"
              icon={DollarSign}
              iconColor="text-success"
              className="h-full min-h-[140px]"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <StatCard
              title="Net Earnings"
              value={`$${stats.netEarnings.toFixed(2)}`}
              change="After 7.5% service fees"
              changeType="neutral"
              icon={DollarSign}
              iconColor="text-primary"
              className="h-full min-h-[140px]"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            <StatCard
              title="Total CO₂ Saved"
              value={`${stats.totalCO2Saved.toFixed(2)} kg`}
              change="Environmental impact"
              changeType="neutral"
              icon={Globe}
              iconColor="text-success"
              className="h-full min-h-[140px]"
            />
          </div>
        </div>

        {/* Incoming Orders and Order Status Chart */}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="rounded-xl border border-border bg-card flex flex-col h-full">
              <div className="border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Incoming Orders Today</h3>
                  <p className="text-sm text-muted-foreground">Orders received today</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="divide-y divide-border">
                  {loading ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">Loading orders...</p>
                    </div>
                  ) : incomingOrders.length > 0 ? (
                    incomingOrders.map((order) => {
                      const status = statusConfig[order.status];
                      const customerInitials = order.user?.name
                        ? order.user.name.split(" ").map(n => n[0]).join("").toUpperCase()
                        : "CU";
                      const itemsList = order.items?.map(item => item.dish?.name).filter(Boolean).join(", ") || "No items";
                      const timeAgo = new Date(order.created_at);
                      const minutesAgo = Math.floor((Date.now() - timeAgo.getTime()) / 60000);
                      const timeDisplay = minutesAgo < 60 ? `${minutesAgo} min ago` : timeAgo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {customerInitials}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">#{order.id}</p>
                                <span className="text-xs text-muted-foreground">• {timeDisplay}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{itemsList}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-foreground">${order.total_price.toFixed(2)}</span>
                            <Badge variant="outline" className={cn("font-medium text-xs uppercase tracking-wide", status.className)}>
                              {status.label}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">No incoming orders today</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Chart */}
          <div className="animate-slide-up" style={{ animationDelay: "600ms" }}>
            <div className="rounded-xl border border-border bg-card p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex-shrink-0">Orders Today</h3>
              <div className="h-[300px] w-full flex-1 min-h-0">
                <ChartContainer config={barChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={todayOrderStatusData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="status"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        width={40}
                      />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const value = payload[0].value as number;
                          return (
                            <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                              <p className="text-sm font-medium text-foreground mb-1">{payload[0].payload.status}</p>
                              <p className="text-sm font-semibold text-foreground">{value} {value === 1 ? 'order' : 'orders'}</p>
                            </div>
                          );
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(145, 65%, 32%)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="animate-slide-up" style={{ animationDelay: "700ms" }}>
          <div className="rounded-xl border border-border bg-card p-6 overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {chartType === "co2" ? "Total CO₂ Saved (KG)" : "Orders Over Time"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {chartType === "co2"
                    ? "CO₂ saved from your restaurant"
                    : "Number of orders from your restaurant"}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {chartType === "co2" ? "CO₂ Saved" : "Orders"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setChartType("co2")}>
                    CO₂ Saved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChartType("orders")}>
                    Orders
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="h-[400px] w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={chartData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      width={60}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        
                        const value = payload[0].value as number;
                        const formattedValue = chartType === "co2" 
                          ? `${value.toFixed(2)} kg`
                          : `${value} ${value === 1 ? 'order' : 'orders'}`;
                        
                        return (
                          <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                            <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ 
                                  backgroundColor: chartType === "co2" 
                                    ? "hsl(145, 65%, 32%)" 
                                    : "hsl(185, 65%, 47%)" 
                                }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {chartType === "co2" ? "CO₂ Saved" : "Orders"}
                              </span>
                              <span className="text-sm font-semibold text-foreground ml-auto">
                                {formattedValue}
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={chartType === "co2" ? "hsl(145, 65%, 32%)" : "hsl(185, 65%, 47%)"}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: chartType === "co2" ? "hsl(145, 65%, 32%)" : "hsl(185, 65%, 47%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
