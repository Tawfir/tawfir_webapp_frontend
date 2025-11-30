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
import { Plus, Search, Filter, Eye, Edit, ChevronDown } from "lucide-react";

interface Restaurant {
  id: number;
  name: string;
  owner: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  created: string;
}

const mockRestaurants: Restaurant[] = [
  { 
    id: 1, 
    name: "Tawfir Restaurant", 
    owner: "Restaurant Owner", 
    address: "123 Test Street", 
    status: "approved", 
    isFeatured: true, 
    created: "29/11/2025" 
  },
];

const statusConfig = {
  pending: { 
    label: "PENDING", 
    className: "bg-warning/10 text-warning border-0 px-3 py-1.5" 
  },
  approved: { 
    label: "APPROVED", 
    className: "bg-primary text-primary-foreground border-0 px-3 py-1.5" 
  },
  rejected: { 
    label: "REJECTED", 
    className: "bg-destructive/10 text-destructive border-0 px-3 py-1.5" 
  },
};

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const activeFiltersCount = [
    statusFilter !== "all",
    featuredFilter !== "all",
  ].filter(Boolean).length;

  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    const matchesSearch = searchQuery === "" || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || restaurant.status === statusFilter;
    const matchesFeatured = featuredFilter === "all" || 
      (featuredFilter === "featured" && restaurant.isFeatured) ||
      (featuredFilter === "not-featured" && !restaurant.isFeatured);
    
    return matchesSearch && matchesStatus && matchesFeatured;
  });

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setStatusFilter("all");
    setFeaturedFilter("all");
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/restaurants">Restaurants</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>List</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Restaurants</h1>
            <p className="mt-1 text-muted-foreground">
              Manage all restaurants on your platform
            </p>
          </div>
          <Button className="w-full sm:w-auto" asChild>
            <Link to="/admin/restaurants/new">
              <Plus className="h-4 w-4 mr-2" />
              New Restaurant
            </Link>
          </Button>
        </div>

        {/* Restaurants Table Card */}
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
                            value="rejected"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Rejected
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Featured
                      </label>
                      <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
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
                            value="featured"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Featured
                          </SelectItem>
                          <SelectItem 
                            value="not-featured"
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            Not Featured
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    ID <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    Name <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    Owner <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    Status <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    Featured <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                    Created <ChevronDown className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedRestaurants.length > 0 ? (
                  paginatedRestaurants.map((restaurant, index) => {
                    const status = statusConfig[restaurant.status];
                    return (
                      <tr 
                        key={`${restaurant.id}-${searchQuery}-${statusFilter}-${featuredFilter}`} 
                        className="transition-all duration-300 hover:bg-muted/30 animate-fade-in"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {restaurant.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                          {restaurant.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {restaurant.owner}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground max-w-xs">
                          <p className="truncate">{restaurant.address}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={cn("font-medium text-xs uppercase tracking-wide", status.className)}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            className={cn(
                              "font-medium text-xs uppercase tracking-wide px-3 py-1.5",
                              restaurant.isFeatured 
                                ? "bg-primary text-primary-foreground border-0" 
                                : "bg-muted text-muted-foreground border-0"
                            )}
                          >
                            {restaurant.isFeatured ? "YES" : "NO"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {restaurant.created}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-muted-foreground hover:bg-primary/10 hover:text-primary"
                              asChild
                            >
                              <Link to={`/admin/restaurants/${restaurant.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-muted-foreground hover:bg-primary/10 hover:text-primary"
                              asChild
                            >
                              <Link to={`/admin/restaurants/${restaurant.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      No restaurants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {paginatedRestaurants.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredRestaurants.length)} of {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'result' : 'results'}
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
