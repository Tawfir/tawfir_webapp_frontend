import { useState } from "react";
import { Link } from "react-router-dom";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Filter, CheckCircle2, XCircle, DollarSign, Clock } from "lucide-react";

interface WithdrawalRequest {
  id: number;
  restaurant: string;
  amount: number;
  method: "stripe" | "manual";
  status: "pending" | "approved" | "declined" | "paid";
  createdAt: string;
}

const mockWithdrawals: WithdrawalRequest[] = [
  // Empty for now - will show empty state
];

const statusConfig = {
  pending: { 
    label: "PENDING", 
    className: "bg-warning/10 text-warning border-0 px-3 py-1.5",
    icon: Clock
  },
  approved: { 
    label: "APPROVED", 
    className: "bg-primary text-primary-foreground border-0 px-3 py-1.5",
    icon: CheckCircle2
  },
  declined: { 
    label: "DECLINED", 
    className: "bg-destructive/10 text-destructive border-0 px-3 py-1.5",
    icon: XCircle
  },
  paid: { 
    label: "PAID", 
    className: "bg-primary text-primary-foreground border-0 px-3 py-1.5",
    icon: CheckCircle2
  },
};

export default function WithdrawalsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const activeFiltersCount = statusFilter !== "all" ? 1 : 0;

  const filteredWithdrawals = mockWithdrawals.filter((withdrawal) => {
    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter;
    return matchesStatus;
  });

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);
  const paginatedWithdrawals = filteredWithdrawals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setStatusFilter("all");
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/withdrawals">Withdrawal Requests</Link>
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Withdrawal Requests</h1>
          <p className="mt-1 text-muted-foreground">
            Review and process restaurant withdrawal requests
          </p>
        </div>

        {/* Withdrawals Table Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Filter Bar */}
          <div className="flex items-center gap-4 p-4 border-b border-border">
            <div className="flex-1" />
            <div className="relative flex items-center gap-2">
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
                            value="pending"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Pending
                          </SelectItem>
                          <SelectItem 
                            value="approved"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Approved
                          </SelectItem>
                          <SelectItem 
                            value="declined"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Declined
                          </SelectItem>
                          <SelectItem 
                            value="paid"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Paid
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Table */}
          {paginatedWithdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Restaurant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedWithdrawals.map((withdrawal, index) => {
                    const status = statusConfig[withdrawal.status];
                    const StatusIcon = status.icon;
                    return (
                      <tr 
                        key={withdrawal.id}
                        className="transition-all duration-300 hover:bg-muted/30 animate-fade-in"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {withdrawal.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                          {withdrawal.restaurant}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="font-semibold">${withdrawal.amount.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground capitalize">
                          {withdrawal.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={cn("font-medium text-xs uppercase tracking-wide flex items-center gap-1.5 w-fit", status.className)}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {withdrawal.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {withdrawal.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                                Approve & Pay
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                                Decline
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No withdrawal requests</p>
                <p className="text-sm text-muted-foreground">
                  Withdrawal requests will appear here when restaurants submit them
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {paginatedWithdrawals.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedWithdrawals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredWithdrawals.length)} of {filteredWithdrawals.length} {filteredWithdrawals.length === 1 ? 'result' : 'results'}
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
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
