import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Star,
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  orders: number;
  status: "active" | "inactive" | "pending";
  image: string;
}

const mockRestaurants: Restaurant[] = [
  { id: "1", name: "Pizza Palace", cuisine: "Italian", location: "Downtown", rating: 4.8, orders: 1234, status: "active", image: "🍕" },
  { id: "2", name: "Burger Hub", cuisine: "American", location: "West Side", rating: 4.5, orders: 987, status: "active", image: "🍔" },
  { id: "3", name: "Sushi Express", cuisine: "Japanese", location: "City Center", rating: 4.9, orders: 756, status: "active", image: "🍣" },
  { id: "4", name: "Taco Town", cuisine: "Mexican", location: "East District", rating: 4.3, orders: 543, status: "inactive", image: "🌮" },
  { id: "5", name: "Curry House", cuisine: "Indian", location: "North Area", rating: 4.7, orders: 432, status: "active", image: "🍛" },
  { id: "6", name: "Noodle Bar", cuisine: "Chinese", location: "South Side", rating: 4.4, orders: 321, status: "pending", image: "🍜" },
];

const statusConfig = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-border" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
};

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = mockRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Restaurants</h1>
            <p className="mt-1 text-muted-foreground">
              Manage all restaurants on your platform
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Restaurant
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center animate-slide-up">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">All Status</Button>
            <Button variant="outline" size="sm">All Cuisines</Button>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.map((restaurant, index) => {
            const status = statusConfig[restaurant.status];
            return (
              <div
                key={restaurant.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                      {restaurant.image}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {restaurant.location}
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {restaurant.rating}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className={cn("font-medium", status.className)}>
                    {status.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {restaurant.orders.toLocaleString()} orders
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
