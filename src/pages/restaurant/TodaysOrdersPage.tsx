import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShoppingCart, CheckCircle } from "lucide-react";

interface Order {
  id: number;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  status: "incoming" | "ready" | "completed";
  time: string;
}

const mockOrders: Order[] = [
  { 
    id: 6, 
    customer: "Normal User", 
    items: [
      { name: "Chicken Sandwhich", quantity: 1, price: 5.00 },
      { name: "Fresh Orange Juice", quantity: 1, price: 2.50 },
    ],
    totalPrice: 12.50, 
    status: "incoming", 
    time: "21:45" 
  },
  { 
    id: 5, 
    customer: "Normal User", 
    items: [
      { name: "Chicken Burger", quantity: 1, price: 10.00 },
      { name: "Iced Latte", quantity: 1, price: 7.50 },
    ],
    totalPrice: 15.25, 
    status: "incoming", 
    time: "16:45" 
  },
  { 
    id: 3, 
    customer: "Normal User", 
    items: [
      { name: "Mac & Cheese Pasta", quantity: 2, price: 10.00 },
    ],
    totalPrice: 28.50, 
    status: "incoming", 
    time: "15:20" 
  },
  { 
    id: 10, 
    customer: "Normal User", 
    items: [
      { name: "Chicken Biryani", quantity: 1, price: 7.50 },
      { name: "Naan Bread", quantity: 2, price: 2.50 },
      { name: "Water Bottle", quantity: 1, price: 1.00 },
    ],
    totalPrice: 35.50, 
    status: "ready", 
    time: "19:15" 
  },
  { 
    id: 8, 
    customer: "Normal User", 
    items: [
      { name: "Veggie Burger", quantity: 1, price: 7.50 },
      { name: "Cheesecake", quantity: 1, price: 5.00 },
    ],
    totalPrice: 18.75, 
    status: "ready", 
    time: "18:00" 
  },
  { 
    id: 18, 
    customer: "Normal User", 
    items: [
      { name: "Chicken Biryani", quantity: 1, price: 7.50 },
      { name: "Naan Bread", quantity: 2, price: 2.50 },
    ],
    totalPrice: 25.00, 
    status: "completed", 
    time: "20:30" 
  },
  { 
    id: 22, 
    customer: "Normal User", 
    items: [
      { name: "Mac & Cheese Pasta", quantity: 2, price: 10.00 },
      { name: "Chocolate Mousse", quantity: 1, price: 7.50 },
    ],
    totalPrice: 42.00, 
    status: "completed", 
    time: "17:30" 
  },
];

const statusConfig = {
  incoming: {
    label: "Incoming",
    color: "bg-warning",
    textColor: "text-warning-foreground",
    buttonColor: "bg-warning hover:bg-warning/90 text-warning-foreground",
  },
  ready: {
    label: "Ready",
    color: "bg-secondary",
    textColor: "text-secondary-foreground",
    buttonColor: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
  },
  completed: {
    label: "Completed",
    color: "bg-primary",
    textColor: "text-primary-foreground",
    buttonColor: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
};

export default function TodaysOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const updateOrderStatus = (orderId: number, newStatus: "incoming" | "ready" | "completed") => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, order: Order) => {
    setDraggedOrder(order);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: "incoming" | "ready" | "completed") => {
    e.preventDefault();
    if (draggedOrder) {
      updateOrderStatus(draggedOrder.id, targetStatus);
    }
    setDraggedOrder(null);
    setDragOverColumn(null);
  };

  const getOrdersByStatus = (status: "incoming" | "ready" | "completed") => {
    return orders.filter((order) => order.status === status);
  };

  const getNextStatus = (currentStatus: "incoming" | "ready" | "completed") => {
    if (currentStatus === "incoming") return "ready";
    if (currentStatus === "ready") return "completed";
    return null;
  };

  const columns: Array<{ id: "incoming" | "ready" | "completed"; label: string }> = [
    { id: "incoming", label: "Incoming" },
    { id: "ready", label: "Ready" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <DashboardLayout portalType="restaurant">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Today's Orders</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage orders received today
          </p>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnOrders = getOrdersByStatus(column.id);
            const isDragOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                className={cn(
                  "flex flex-col rounded-xl border border-border bg-card min-h-[600px] transition-all",
                  isDragOver && "ring-2 ring-primary ring-offset-2 bg-primary/5"
                )}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className={cn(
                  "flex items-center justify-between p-4 border-b border-border rounded-t-xl",
                  statusConfig[column.id].color,
                  statusConfig[column.id].textColor
                )}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">
                      {statusConfig[column.id].label}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "bg-background/20 border-background/30 text-current",
                        statusConfig[column.id].textColor
                      )}
                    >
                      {columnOrders.length}
                    </Badge>
                  </div>
                </div>

                {/* Orders List */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0">
                  {columnOrders.length > 0 ? (
                    columnOrders.map((order) => {
                      const nextStatus = getNextStatus(order.status);
                      return (
                        <div
                          key={order.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, order)}
                          onDragEnd={() => {
                            setDraggedOrder(null);
                            setDragOverColumn(null);
                          }}
                          className={cn(
                            "rounded-lg border border-border bg-card p-4 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:-translate-y-0.5",
                            draggedOrder?.id === order.id && "opacity-50 scale-95"
                          )}
                        >
                          <div className="space-y-3">
                            {/* Order Header */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-foreground">Order #{order.id}</p>
                                <p className="text-xs text-muted-foreground">{order.time}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">{order.customer}</p>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-1.5">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span className="text-foreground">
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="text-muted-foreground">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span className="font-semibold text-foreground">Total</span>
                              <span className="font-bold text-primary">
                                ${order.totalPrice.toFixed(2)}
                              </span>
                            </div>

                            {/* Action Button */}
                            {nextStatus && (
                              <Button
                                size="sm"
                                className={cn("w-full mt-2", statusConfig[order.status].buttonColor)}
                                onClick={() => updateOrderStatus(order.id, nextStatus)}
                              >
                                {nextStatus === "ready" ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Ready
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Completed
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground">No orders</p>
                    </div>
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
