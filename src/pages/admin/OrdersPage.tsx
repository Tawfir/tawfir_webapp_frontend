import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Search, Filter, Eye, ChevronDown, Calendar, X } from "lucide-react";

interface Order {
  id: number;
  customer: string;
  restaurant: string;
  totalPrice: number;
  status: "incoming" | "ready" | "completed";
  date: string;
}

const mockOrders: Order[] = [
  { id: 6, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 12.50, status: "incoming", date: "29/11/2025 21:45" },
  { id: 18, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 25.00, status: "completed", date: "29/11/2025 20:30" },
  { id: 10, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 35.50, status: "ready", date: "29/11/2025 19:15" },
  { id: 8, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 18.75, status: "ready", date: "29/11/2025 18:00" },
  { id: 22, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 42.00, status: "completed", date: "29/11/2025 17:30" },
  { id: 5, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 15.25, status: "incoming", date: "29/11/2025 16:45" },
  { id: 3, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 28.50, status: "incoming", date: "29/11/2025 15:20" },
  { id: 1, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 20.00, status: "incoming", date: "29/11/2025 14:10" },
  { id: 15, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 87.50, status: "completed", date: "29/11/2025 13:00" },
  { id: 19, customer: "Normal User", restaurant: "Tawfir Restaurant", totalPrice: 55.75, status: "completed", date: "29/11/2025 12:30" },
];

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

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [untilDate, setUntilDate] = useState<Date | undefined>();
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const activeFiltersCount = [
    orderIdFilter,
    statusFilter !== "all",
    fromDate,
    untilDate,
  ].filter(Boolean).length;

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = searchQuery === "" || 
      order.id.toString().includes(searchQuery) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesOrderId = !orderIdFilter || order.id.toString() === orderIdFilter;
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesOrderId && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setOrderIdFilter("");
    setStatusFilter("all");
    setFromDate(undefined);
    setUntilDate(undefined);
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/orders">Orders</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>List</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all orders from restaurants
          </p>
        </div>

        {/* Orders Table Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 p-4 border-b border-border">
            <div className="flex-1" />
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Filter className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-destructive hover:text-destructive"
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Order #
                      </label>
                      <Input
                        placeholder="Enter order number"
                        value={orderIdFilter}
                        onChange={(e) => setOrderIdFilter(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Status
                      </label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="focus:ring-primary">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem 
                            value="all"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            All
                          </SelectItem>
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        From Date
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={fromDate ? fromDate.toISOString().split('T')[0] : ""}
                          onChange={(e) => setFromDate(e.target.value ? new Date(e.target.value) : undefined)}
                          className="pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary pointer-events-none z-10" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Until Date
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={untilDate ? untilDate.toISOString().split('T')[0] : ""}
                          onChange={(e) => setUntilDate(e.target.value ? new Date(e.target.value) : undefined)}
                          className="pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary pointer-events-none z-10" />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    Order # <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Restaurant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    Total price <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    Status <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    Date <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, index) => {
                    const status = statusConfig[order.status];
                    return (
                      <tr 
                        key={`${order.id}-${searchQuery}-${statusFilter}-${orderIdFilter}`} 
                        className="transition-all duration-300 hover:bg-muted/30 animate-fade-in"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {order.restaurant}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={cn("font-medium text-xs uppercase tracking-wide", status.className)}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            asChild
                          >
                            <Link to={`/admin/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Per page</span>
                <Select value={itemsPerPage.toString()} onValueChange={() => {}}>
                  <SelectTrigger className="w-20 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      value="10"
                      className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                    >
                      10
                    </SelectItem>
                    <SelectItem 
                      value="20"
                      className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                    >
                      20
                    </SelectItem>
                    <SelectItem 
                      value="50"
                      className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                    >
                      50
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "min-w-[2.5rem]",
                      currentPage === page && "bg-primary text-primary-foreground"
                    )}
                  >
                    {page}
                  </Button>
                ))}
                {currentPage < totalPages && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    &gt;
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
