import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  customer: string;
  restaurant: string;
  amount: string;
  status: "pending" | "preparing" | "delivered" | "cancelled";
  time: string;
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  preparing: { label: "Preparing", className: "bg-info/10 text-info border-info/20" },
  delivered: { label: "Delivered", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const mockOrders: Order[] = [
  { id: "ORD-001", customer: "Ahmed Ali", restaurant: "Pizza Palace", amount: "$45.00", status: "preparing", time: "5 min ago" },
  { id: "ORD-002", customer: "Sara Khan", restaurant: "Burger Hub", amount: "$28.50", status: "pending", time: "12 min ago" },
  { id: "ORD-003", customer: "Mohammed Hassan", restaurant: "Sushi Express", amount: "$67.00", status: "delivered", time: "25 min ago" },
  { id: "ORD-004", customer: "Fatima Noor", restaurant: "Taco Town", amount: "$32.00", status: "preparing", time: "30 min ago" },
  { id: "ORD-005", customer: "Omar Sheikh", restaurant: "Pizza Palace", amount: "$55.00", status: "cancelled", time: "45 min ago" },
];

export function RecentOrdersTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
        <p className="text-sm text-muted-foreground">Latest orders across all restaurants</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockOrders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                    {order.customer}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {order.restaurant}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-foreground">
                    {order.amount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant="outline" className={cn("font-medium", status.className)}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {order.time}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
