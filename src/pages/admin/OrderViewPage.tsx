import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, User, Store, DollarSign, Clock } from "lucide-react";

interface OrderItem {
  dishName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customer: string;
  restaurant: string;
  totalPrice: number;
  status: "incoming" | "ready" | "completed";
  date: string;
  pickupTime: string;
  items: OrderItem[];
}

// Mock data - replace with API call
const mockOrder: Order = {
  id: 6,
  customer: "Normal User",
  restaurant: "Tawfir Restaurant",
  totalPrice: 12.50,
  status: "incoming",
  date: "29/11/2025 21:45",
  pickupTime: "22:00",
  items: [
    { dishName: "Margherita Pizza", quantity: 1, price: 12.50 },
  ],
};

const statusConfig = {
  incoming: { 
    label: "INCOMING", 
    className: "bg-primary/70 text-primary-foreground border-0 px-3 py-1.5" 
  },
  ready: { 
    label: "READY", 
    className: "bg-primary/70 text-primary-foreground border-0 px-3 py-1.5" 
  },
  completed: { 
    label: "COMPLETED", 
    className: "bg-primary text-primary-foreground border-0 px-3 py-1.5" 
  },
};

export default function OrderViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = mockOrder; // In real app, fetch by id

  const status = statusConfig[order.status];

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/orders")}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Order #{order.id}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Order details and information</p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>
              <Badge className={cn("font-medium text-xs uppercase tracking-wide", status.className)}>
                {status.label}
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p className="text-base font-semibold text-foreground">{order.customer}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Restaurant</p>
                    <p className="text-base font-semibold text-foreground">{order.restaurant}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                    <p className="text-base font-semibold text-foreground">{order.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pickup Time</p>
                    <p className="text-base font-semibold text-foreground">{order.pickupTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.dishName}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">${Number(item.price).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <p className="text-lg font-semibold text-foreground">Total Price</p>
                </div>
                <p className="text-2xl font-bold text-primary">${Number(order.totalPrice).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

