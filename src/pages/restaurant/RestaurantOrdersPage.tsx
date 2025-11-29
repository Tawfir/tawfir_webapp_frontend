import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Check, ChefHat, Truck, RefreshCw } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  phone: string;
  items: { name: string; quantity: number; price: string }[];
  total: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered";
  type: "delivery" | "pickup";
  time: string;
  address?: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-101",
    customer: "Ahmed Ali",
    phone: "+1 234 567 8901",
    items: [
      { name: "Margherita Pizza", quantity: 2, price: "$37.98" },
      { name: "Garlic Bread", quantity: 1, price: "$6.99" },
    ],
    total: "$44.97",
    status: "pending",
    type: "delivery",
    time: "2 min ago",
    address: "123 Main St, Apt 4B",
  },
  {
    id: "ORD-102",
    customer: "Sara Khan",
    phone: "+1 234 567 8902",
    items: [{ name: "Pepperoni Pizza", quantity: 1, price: "$20.99" }],
    total: "$20.99",
    status: "preparing",
    type: "pickup",
    time: "8 min ago",
  },
  {
    id: "ORD-103",
    customer: "Mohammed Hassan",
    phone: "+1 234 567 8903",
    items: [
      { name: "Hawaiian Pizza", quantity: 1, price: "$19.99" },
      { name: "Caesar Salad", quantity: 1, price: "$12.99" },
      { name: "Tiramisu", quantity: 2, price: "$17.98" },
    ],
    total: "$50.96",
    status: "ready",
    type: "delivery",
    time: "18 min ago",
    address: "456 Oak Ave",
  },
  {
    id: "ORD-104",
    customer: "Fatima Noor",
    phone: "+1 234 567 8904",
    items: [{ name: "Veggie Supreme", quantity: 1, price: "$21.99" }],
    total: "$21.99",
    status: "confirmed",
    type: "pickup",
    time: "12 min ago",
  },
];

const statusConfig = {
  pending: { label: "New Order", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  confirmed: { label: "Confirmed", className: "bg-info/10 text-info border-info/20", icon: Check },
  preparing: { label: "Preparing", className: "bg-primary/10 text-primary border-primary/20", icon: ChefHat },
  ready: { label: "Ready", className: "bg-success/10 text-success border-success/20", icon: Truck },
  delivered: { label: "Delivered", className: "bg-muted text-muted-foreground border-border", icon: Check },
};

const statusFlow = ["pending", "confirmed", "preparing", "ready", "delivered"] as const;

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);

  const updateOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const currentIndex = statusFlow.indexOf(order.status);
          if (currentIndex < statusFlow.length - 1) {
            return { ...order, status: statusFlow[currentIndex + 1] };
          }
        }
        return order;
      })
    );
  };

  const getNextStatusLabel = (currentStatus: string) => {
    const index = statusFlow.indexOf(currentStatus as typeof statusFlow[number]);
    if (index < statusFlow.length - 1) {
      return statusConfig[statusFlow[index + 1]].label;
    }
    return null;
  };

  return (
    <DashboardLayout portalType="restaurant">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and track incoming orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-sm text-muted-foreground">Live Updates</span>
            <Button variant="outline" size="sm" className="ml-2">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order, index) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const nextStatus = getNextStatusLabel(order.status);

            return (
              <div
                key={order.id}
                className="rounded-xl border border-border bg-card overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", status.className)}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("font-medium", status.className)}>
                      {status.label}
                    </Badge>
                    <Badge variant="outline">
                      {order.type === "delivery" ? "🚗 Delivery" : "🏪 Pickup"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Customer Info */}
                  <div>
                    <p className="font-medium text-foreground">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.phone}</p>
                    {order.address && (
                      <p className="text-sm text-muted-foreground mt-1">📍 {order.address}</p>
                    )}
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-muted-foreground">{item.price}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-primary">{order.total}</span>
                    </div>
                  </div>

                  {/* Action */}
                  {nextStatus && (
                    <Button
                      className="w-full"
                      onClick={() => updateOrderStatus(order.id)}
                    >
                      Mark as {nextStatus}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
