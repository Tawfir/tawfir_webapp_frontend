import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, User, Clock, DollarSign, Package } from "lucide-react";
import { restaurantApi } from "@/services/api";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  dish_id: number;
  quantity: number;
  price: number;
  dish: {
    id: number;
    name: string;
    image?: string;
    price: number;
  };
}

interface Order {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  total_price: number;
  status: "incoming" | "ready" | "completed" | "cancelled";
  created_at: string;
  pickup_time?: string;
  items: OrderItem[];
}

const statusConfig = {
  incoming: { 
    label: "INCOMING", 
    className: "bg-warning text-warning-foreground border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
  ready: { 
    label: "READY", 
    className: "bg-secondary text-secondary-foreground border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
  completed: { 
    label: "COMPLETED", 
    className: "bg-primary text-primary-foreground border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
  cancelled: { 
    label: "CANCELLED", 
    className: "bg-destructive text-destructive-foreground border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
};

export default function RestaurantOrderViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<"incoming" | "ready" | "completed" | "cancelled">("incoming");

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orderId = parseInt(id!);
      if (isNaN(orderId)) {
        toast.error("Invalid order ID");
        navigate("/restaurant/orders");
        return;
      }

      const response = await restaurantApi.getOrder(orderId);
      if (response.status && response.data?.order) {
        const orderData = response.data.order;
        setOrder(orderData);
        setStatus(orderData.status);
      } else {
        toast.error(response.message || "Order not found");
        navigate("/restaurant/orders");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load order");
      navigate("/restaurant/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: "incoming" | "ready" | "completed" | "cancelled") => {
    if (!id || !order) return;

    try {
      setUpdating(true);
      const response = await restaurantApi.updateOrderStatus(parseInt(id), newStatus);
      if (response.status) {
        toast.success("Order status updated successfully");
        setStatus(newStatus);
        setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
      } else {
        toast.error(response.message || "Failed to update order status");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout portalType="restaurant">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout portalType="restaurant">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusBadge = statusConfig[order.status];
  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <DashboardLayout portalType="restaurant">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/restaurant/orders">Orders</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Order #{order.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/restaurant/orders")}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Order #{order.id}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Order details and information</p>
            </div>
          </div>
          <Badge className={cn("font-medium text-xs uppercase tracking-wide", statusBadge.className)}>
            {statusBadge.label}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Order Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p className="text-base font-semibold text-foreground">{order.user.name}</p>
                    {order.user.email && (
                      <p className="text-sm text-muted-foreground">{order.user.email}</p>
                    )}
                    {order.user.phone && (
                      <p className="text-sm text-muted-foreground">{order.user.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                    <p className="text-base font-semibold text-foreground">{formattedDate}</p>
                  </div>
                </div>

                {order.pickup_time && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pickup Time</p>
                      <p className="text-base font-semibold text-foreground">{order.pickup_time}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Update Card */}
            {order.status !== "cancelled" && order.status !== "completed" && (
              <Card>
                <CardHeader>
                  <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Order Status
                      </label>
                      <Select
                        value={status}
                        onValueChange={(value: "incoming" | "ready" | "completed" | "cancelled") => {
                          setStatus(value);
                        }}
                        disabled={updating}
                      >
                        <SelectTrigger className="focus:ring-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem 
                            value="incoming"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Incoming
                          </SelectItem>
                          <SelectItem 
                            value="ready"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Ready
                          </SelectItem>
                          <SelectItem 
                            value="completed"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Completed
                          </SelectItem>
                          <SelectItem 
                            value="cancelled"
                            className="focus:bg-destructive focus:text-destructive-foreground data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground"
                          >
                            Cancelled
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => handleStatusChange(status)}
                      disabled={updating || status === order.status}
                      className="w-full"
                    >
                      {updating ? "Updating..." : "Update Status"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Items */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => {
                      const itemPrice = Number(item.price) || Number(item.dish?.price) || 0;
                      const itemTotal = itemPrice * item.quantity;
                      
                      return (
                        <div
                          key={item.id || index}
                          className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30"
                        >
                          {item.dish?.image && item.dish.image.trim() !== "" && !item.dish.image.includes('via.placeholder') ? (
                            <img
                              src={item.dish.image}
                              alt={item.dish.name}
                              className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Package className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{item.dish?.name || "Unknown Dish"}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            <p className="text-sm text-muted-foreground">${itemPrice.toFixed(2)} each</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">${itemTotal.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No items found</p>
                  )}
                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <p className="text-lg font-semibold text-foreground">Total Price</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      ${Number(order.total_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

