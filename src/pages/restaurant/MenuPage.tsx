import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { restaurantApi } from "@/services/api";
import { toast } from "sonner";

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discounted_price: number | null;
  quantity: number;
  image: string | null;
  pickup_time: string | null;
  categories?: Array<{ id: number; name: string }>;
}

export default function MenuPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetchDishes();
  }, [location.key]); // Refresh when location changes (navigating back to this page)

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await restaurantApi.getDishes();
      if (response.status && response.data.dishes) {
        setDishes(response.data.dishes);
        
        // Extract unique categories
        const allCategories = new Set<string>(["All"]);
        response.data.dishes.forEach((dish: MenuItem) => {
          dish.categories?.forEach((cat) => allCategories.add(cat.name));
        });
        setCategories(Array.from(allCategories));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load dishes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) {
      return;
    }

    try {
      await restaurantApi.deleteDish(id);
      toast.success("Dish deleted successfully");
      fetchDishes();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete dish");
    }
  };

  const filteredItems = dishes.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "All" || 
      item.categories?.some(cat => cat.name === activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout portalType="restaurant">
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/restaurant/menu">Dishes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>List</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dishes</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your restaurant's menu items
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/restaurant/menu/new">
              <Plus className="h-4 w-4 mr-2" />
              New Dish
            </Link>
          </Button>
        </div>

        {/* Search and Categories */}
        <div className="space-y-4 animate-slide-up">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading dishes...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item, index) => {
              const originalPrice = item.discounted_price ? Number(item.price) : null;
              const sellingPrice = Number(item.discounted_price || item.price);
              const primaryCategory = item.categories?.[0]?.name || "Uncategorized";
              
              return (
                <Link
                  key={item.id}
                  to={`/restaurant/menu/${item.id}/edit`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in cursor-pointer block"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Dish Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    {item.image && item.image.trim() !== "" && !item.image.includes('via.placeholder') ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-5xl">🍽️</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Dish Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/restaurant/menu/${item.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Price and Category */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        {originalPrice && originalPrice > sellingPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-primary">
                          ${sellingPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {primaryCategory}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs font-semibold",
                            item.quantity > 0 
                              ? "bg-success/10 text-success border-success/20" 
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          )}
                        >
                          {item.quantity > 0 ? `${item.quantity} left` : "Out of stock"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Hover Gradient Border */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No dishes found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
