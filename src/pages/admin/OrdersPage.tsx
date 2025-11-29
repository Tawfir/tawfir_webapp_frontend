import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, Filter, Eye, RefreshCw } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  restaurant: string;
  items: string[];
  amount: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "refunded";
  time: string;
  date: string;
}

const mockOrders: Order[] = [
  { id: "ORD-001", customer: "Ahmed Ali", restaurant: "Pizza Palace", items: ["Margherita Pizza", "Garlic Bread"], amount: "$45.00", status: "preparing", paymentStatus: "paid", time: "12:30 PM", date: "Today" },
  { id: "ORD-002", customer: "Sara Khan", restaurant: "Burger Hub", items: ["Classic Burger", "Fries", "Cola"], amount: "$28.50", status: "pending", paymentStatus: "pending", time: "12:25 PM", date: "Today" },
  { id: "ORD-003", customer: "Mohammed Hassan", restaurant: "Sushi Express", items: ["Salmon Roll", "Tuna Sashimi"], amount: "$67.00", status: "delivered", paymentStatus: "paid", time: "11:45 AM", date: "Today" },
  { id: "ORD-004", customer: "Fatima Noor", restaurant: "Taco Town", items: ["Beef Tacos x3", "Nachos"], amount: "$32.00", status: "ready", paymentStatus: "paid", time: "11:30 AM", date: "Today" },
  { id: "ORD-005", customer: "Omar Sheikh", restaurant: "Pizza Palace", items: ["Pepperoni Pizza", "Buffalo Wings"], amount: "$55.00", status: "cancelled", paymentStatus: "refunded", time: "11:00 AM", date: "Today" },
  { id: "ORD-006", customer: "Layla Ahmed", restaurant: "Curry House", items: ["Butter Chicken", "Naan", "Rice"], amount: "$42.00", status: "confirmed", paymentStatus: "paid", time: "10:45 AM", date: "Today" },
  { id: "ORD-007", customer: "Yusuf Ibrahim", restaurant: "Noodle Bar", items: ["Pad Thai", "Spring Rolls"], amount: "$35.00", status: "delivered", paymentStatus: "paid", time: "10:30 AM", date: "Today" },
];

const statusConfig = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  confirmed: { label: "Confirmed", className: "bg-info/10 text-info border-info/20" },
  preparing: { label: "Preparing", className: "bg-primary/10 text-primary border-primary/20" },
  ready: { label: "Ready", className: "bg-success/10 text-success border-success/20" },
  delivered: { label: "Delivered", className: "bg-muted text-muted-foreground border-border" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const paymentConfig = {
  paid: { label: "Paid", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  refunded: { label: "Refunded", className: "bg-muted text-muted-foreground border-border" },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
            <p className="mt-1 text-muted-foreground">
              Monitor and manage all platform orders
            </p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center animate-slide-up">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Restaurant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const payment = paymentConfig[order.paymentStatus];
                  return (
                    <tr key={order.id} className="transition-colors hover:bg-muted/30">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.date} • {order.time}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                        {order.customer}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {order.restaurant}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {order.items.join(", ")}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-foreground">
                        {order.amount}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge variant="outline" className={cn("font-medium", status.className)}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge variant="outline" className={cn("font-medium", payment.className)}>
                          {payment.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
