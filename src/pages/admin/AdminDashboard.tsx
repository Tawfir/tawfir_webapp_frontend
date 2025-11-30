import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Store, ShoppingBag, Globe, DollarSign, ChevronDown } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual API calls
const mockStats = {
  totalRestaurants: 1,
  surplusItemsDistributed: 60,
  totalCO2Saved: 189.0,
  platformRevenue: 31.88,
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
      // CO2 data - mostly flat until recent spike
      const value = i < 3 ? (189 / 3) * (3 - i) : 0;
      data.push({ date: `${month} ${day}`, value: parseFloat(value.toFixed(2)) });
    } else {
      // Orders data
      const value = Math.floor(Math.random() * 10) + (i < 3 ? 5 : 0);
      data.push({ date: `${month} ${day}`, value });
    }
  }
  return data;
};

export default function AdminDashboard() {
  const [chartType, setChartType] = useState<"co2" | "orders">("co2");
  const chartData = generateChartData(chartType);

  const chartConfig = {
    value: {
      label: chartType === "co2" ? "CO₂ Saved (KG)" : "Completed Orders",
      color: chartType === "co2" ? "hsl(145, 65%, 32%)" : "hsl(185, 65%, 47%)",
    },
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        </div>

        {/* Welcome Card */}
        <div className="animate-slide-up rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-lg font-semibold text-primary">AD</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Welcome back Admin User</h2>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard
              title="Registered Restaurants"
              value={mockStats.totalRestaurants}
              change="Total restaurants on the platform"
              changeType="neutral"
              icon={Store}
              iconColor="text-primary"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <StatCard
              title="Surplus Items Distributed"
              value={`${mockStats.surplusItemsDistributed} items`}
              change="From all completed orders"
              changeType="neutral"
              icon={ShoppingBag}
              iconColor="text-success"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <StatCard
              title="Total CO₂ Saved"
              value={`${mockStats.totalCO2Saved.toFixed(2)} kg`}
              change="Environmental impact across all restaurants"
              changeType="neutral"
              icon={Globe}
              iconColor="text-success"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <StatCard
              title="Platform Revenue"
              value={`$${mockStats.platformRevenue.toFixed(2)}`}
              change="7.5% service fees earned from restaurants"
              changeType="neutral"
              icon={DollarSign}
              iconColor="text-primary"
            />
          </div>
        </div>

        {/* Chart */}
        <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="rounded-xl border border-border bg-card p-6 overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {chartType === "co2" ? "Total CO₂ Saved (KG)" : "Completed Orders Over Time"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {chartType === "co2"
                    ? "CO₂ saved across all restaurants"
                    : "Number of completed orders across all restaurants"}
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
                                {chartType === "co2" ? "CO₂ Saved" : "Completed Orders"}
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
