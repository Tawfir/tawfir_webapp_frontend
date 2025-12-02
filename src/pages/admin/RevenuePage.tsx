import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/services/api";
import { toast } from "sonner";
import { DollarSign, CreditCard, Banknote, TrendingUp, TrendingDown, Send, FileText, ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MonthlyRevenue {
  month: string;
  card_revenue: string;
  cash_revenue: string;
  card_amount_owed: string;
  cash_commission_owed: string;
  net_balance: string;
}

interface RestaurantRevenue {
  id: number;
  name: string;
  status: string;
  card_revenue: string;
  cash_revenue: string;
  card_amount_owed: string;
  cash_commission_owed: string;
  net_balance: string;
  monthly?: MonthlyRevenue[];
}

export default function RevenuePage() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<RestaurantRevenue[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantRevenue | null>(null);
  const [expandedRestaurants, setExpandedRestaurants] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getRevenueManagement();
      if (response.status && response.data) {
        setRestaurants(response.data.restaurants || []);
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

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const toggleRestaurant = (restaurantId: number) => {
    const newExpanded = new Set(expandedRestaurants);
    if (newExpanded.has(restaurantId)) {
      newExpanded.delete(restaurantId);
    } else {
      newExpanded.add(restaurantId);
    }
    setExpandedRestaurants(newExpanded);
  };

  const handlePayRestaurant = async (restaurant: RestaurantRevenue) => {
    try {
      setProcessingId(restaurant.id);
      const response = await adminApi.payRestaurant(restaurant.id);
      if (response.status) {
        toast.success(`Payment of ${formatCurrency(restaurant.card_amount_owed)} sent to ${restaurant.name}`);
        fetchRevenue();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment");
    } finally {
      setProcessingId(null);
      setPayDialogOpen(false);
      setSelectedRestaurant(null);
    }
  };

  const handleRequestPayment = async (restaurant: RestaurantRevenue) => {
    try {
      setProcessingId(restaurant.id);
      const response = await adminApi.requestPaymentFromRestaurant(restaurant.id);
      if (response.status) {
        toast.success(`Payment request of ${formatCurrency(restaurant.cash_commission_owed)} sent to ${restaurant.name}`);
        fetchRevenue();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create payment request");
    } finally {
      setProcessingId(null);
      setRequestDialogOpen(false);
      setSelectedRestaurant(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout portalType="admin">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading revenue data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Revenue Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage payments and commissions for all restaurants
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurants.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive Balance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {restaurants.filter(r => parseFloat(r.net_balance) > 0).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Negative Balance</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {restaurants.filter(r => parseFloat(r.net_balance) < 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restaurants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Revenue</CardTitle>
            <CardDescription>View and manage payments for each restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            {restaurants.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Card Revenue</TableHead>
                      <TableHead>Cash Revenue</TableHead>
                      <TableHead>Amount Owed</TableHead>
                      <TableHead>Commission Owed</TableHead>
                      <TableHead>Net Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restaurants.map((restaurant) => {
                      const netBalance = parseFloat(restaurant.net_balance);
                      const isPositive = netBalance > 0;
                      const isNegative = netBalance < 0;
                      const cardAmountOwed = parseFloat(restaurant.card_amount_owed);
                      const cashCommissionOwed = parseFloat(restaurant.cash_commission_owed);
                      const isExpanded = expandedRestaurants.has(restaurant.id);

                      return (
                        <>
                          <TableRow key={restaurant.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRestaurant(restaurant.id)}>
                            <TableCell>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{restaurant.name}</TableCell>
                            <TableCell>
                              <Badge variant={restaurant.status === 'approved' ? 'default' : 'secondary'}>
                                {restaurant.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(restaurant.card_revenue)}</TableCell>
                            <TableCell>{formatCurrency(restaurant.cash_revenue)}</TableCell>
                            <TableCell>{formatCurrency(restaurant.card_amount_owed)}</TableCell>
                            <TableCell>{formatCurrency(restaurant.cash_commission_owed)}</TableCell>
                            <TableCell>
                              <span className={isPositive ? 'text-green-600 font-semibold' : isNegative ? 'text-red-600 font-semibold' : ''}>
                                {formatCurrency(restaurant.net_balance)}
                              </span>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                {isPositive && cardAmountOwed > 0 && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => {
                                      setSelectedRestaurant(restaurant);
                                      setPayDialogOpen(true);
                                    }}
                                    disabled={processingId === restaurant.id}
                                  >
                                    <Send className="h-4 w-4 mr-1" />
                                    Pay Restaurant
                                  </Button>
                                )}
                                {isNegative && cashCommissionOwed > 0 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedRestaurant(restaurant);
                                      setRequestDialogOpen(true);
                                    }}
                                    disabled={processingId === restaurant.id}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Request Payment
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                          {isExpanded && restaurant.monthly && restaurant.monthly.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={9} className="bg-muted/30">
                                <div className="py-4">
                                  <h4 className="font-semibold mb-3">Monthly Breakdown</h4>
                                  <div className="overflow-x-auto">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Month</TableHead>
                                          <TableHead>Card Revenue</TableHead>
                                          <TableHead>Cash Revenue</TableHead>
                                          <TableHead>Amount Owed</TableHead>
                                          <TableHead>Commission Owed</TableHead>
                                          <TableHead>Net Balance</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {restaurant.monthly.map((month, index) => {
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
                                                <span className={monthNetBalance >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                                  {formatCurrency(month.net_balance)}
                                                </span>
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No restaurants found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pay Restaurant Dialog */}
        <AlertDialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Pay Restaurant</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to send a payment of{" "}
                <strong>{selectedRestaurant && formatCurrency(selectedRestaurant.card_amount_owed)}</strong> to{" "}
                <strong>{selectedRestaurant?.name}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedRestaurant && handlePayRestaurant(selectedRestaurant)}
                disabled={processingId !== null}
              >
                Confirm Payment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Request Payment Dialog */}
        <AlertDialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Request Payment from Restaurant</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to send a payment request of{" "}
                <strong>{selectedRestaurant && formatCurrency(selectedRestaurant.cash_commission_owed)}</strong> to{" "}
                <strong>{selectedRestaurant?.name}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedRestaurant && handleRequestPayment(selectedRestaurant)}
                disabled={processingId !== null}
              >
                Send Request
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}

