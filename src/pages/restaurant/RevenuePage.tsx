import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { restaurantApi } from "@/services/api";
import { toast } from "sonner";
import { DollarSign, CreditCard, Banknote, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RevenueSummary {
  card_revenue: string;
  cash_revenue: string;
  card_amount_owed: string;
  cash_commission_owed: string;
  net_balance: string;
  total_revenue: string;
}

interface MonthlyRevenue {
  month: string;
  card_revenue: string;
  cash_revenue: string;
  card_amount_owed: string;
  cash_commission_owed: string;
  net_balance: string;
}

interface OrderRevenue {
  id: number;
  total_price: string;
  payment_method: 'card' | 'cash' | null;
  status: string;
  created_at: string;
  net_total: string;
}

export default function RevenuePage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);
  const [orders, setOrders] = useState<OrderRevenue[]>([]);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const response = await restaurantApi.getRevenue();
      if (response.status && response.data) {
        setSummary(response.data.summary);
        setMonthly(response.data.monthly || []);
        setOrders(response.data.orders || []);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <DashboardLayout portalType="restaurant">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading revenue data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!summary) {
    return (
      <DashboardLayout portalType="restaurant">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No revenue data available</p>
        </div>
      </DashboardLayout>
    );
  }

  const netBalance = parseFloat(summary.net_balance);
  const isPositive = netBalance >= 0;

  return (
    <DashboardLayout portalType="restaurant">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Revenue Management</h1>
          <p className="mt-1 text-muted-foreground">
            Track your revenue, commissions, and payments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.total_revenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All completed orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Card Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.card_revenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Amount owed to you: {formatCurrency(summary.card_amount_owed)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Revenue</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.cash_revenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Commission owed: {formatCurrency(summary.cash_commission_owed)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.net_balance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isPositive 
                  ? 'Tawfir owes you this amount' 
                  : 'You owe Tawfir this amount'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Breakdown</CardTitle>
            <CardDescription>Revenue and commission breakdown by month</CardDescription>
          </CardHeader>
          <CardContent>
            {monthly.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Card Revenue</TableHead>
                      <TableHead>Cash Revenue</TableHead>
                      <TableHead>Amount Owed to You</TableHead>
                      <TableHead>Commission Owed</TableHead>
                      <TableHead>Net Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthly.map((month, index) => {
                      const monthNetBalance = parseFloat(month.net_balance);
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {formatMonth(month.month)}
                          </TableCell>
                          <TableCell>{formatCurrency(month.card_revenue)}</TableCell>
                          <TableCell>{formatCurrency(month.cash_revenue)}</TableCell>
                          <TableCell>{formatCurrency(month.card_amount_owed)}</TableCell>
                          <TableCell>{formatCurrency(month.cash_commission_owed)}</TableCell>
                          <TableCell>
                            <span className={monthNetBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(month.net_balance)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No monthly data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Order Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Individual order revenue breakdown. Net Total shows the amount after 7.5% commission deduction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Net Total for Restaurant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>
                          {order.payment_method ? (
                            <Badge variant={order.payment_method === 'card' ? 'default' : 'secondary'}>
                              {order.payment_method.toUpperCase()}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">N/A</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(order.total_price)}</TableCell>
                        <TableCell className="font-semibold">
                          {order.payment_method ? formatCurrency(order.net_total) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No orders available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

