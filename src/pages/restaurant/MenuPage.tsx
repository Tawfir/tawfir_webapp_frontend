import { useState } from "react";
import { Link } from "react-router-dom";
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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  sellingPrice: number;
  quantity: number;
  category: string;
  image: string | null;
  pickupTime: string;
}

const mockMenuItems: MenuItem[] = [
  { id: "1", name: "Chicken Sandwhich", description: "Delicious chicken sandwich", originalPrice: 10.00, sellingPrice: 5.00, quantity: 5, category: "Sandwiches", image: null, pickupTime: "22:00" },
  { id: "2", name: "Falafel Sandwhich", description: "Fresh falafel sandwich", originalPrice: 10.00, sellingPrice: 5.00, quantity: 10, category: "Sandwiches", image: null, pickupTime: "10:00" },
  { id: "3", name: "Fresh Orange Juice", description: "Freshly squeezed orange juice", originalPrice: 5.00, sellingPrice: 2.50, quantity: 0, category: "Drinks", image: null, pickupTime: "20:00" },
  { id: "4", name: "Iced Latte", description: "Cold iced latte", originalPrice: 15.00, sellingPrice: 7.50, quantity: 5, category: "Drinks", image: null, pickupTime: "20:30" },
  { id: "5", name: "Chocolate Mousse", description: "Rich chocolate mousse", originalPrice: 15.00, sellingPrice: 7.50, quantity: 0, category: "Desserts", image: null, pickupTime: "21:30" },
  { id: "6", name: "Cheesecake", description: "Classic cheesecake", originalPrice: 10.00, sellingPrice: 5.00, quantity: 0, category: "Desserts", image: null, pickupTime: "21:30" },
  { id: "7", name: "Chicken Burger", description: "Juicy chicken burger", originalPrice: 20.00, sellingPrice: 10.00, quantity: 0, category: "Burgers", image: null, pickupTime: "18:00" },
  { id: "8", name: "Veggie Burger", description: "Plant-based veggie burger", originalPrice: 15.00, sellingPrice: 7.50, quantity: 4, category: "Burgers", image: null, pickupTime: "18:00" },
  { id: "9", name: "Mac & Cheese Pasta", description: "Creamy mac and cheese", originalPrice: 20.00, sellingPrice: 10.00, quantity: 30, category: "Hot Meals", image: null, pickupTime: "22:00" },
  { id: "10", name: "Chicken Biryani", description: "Spiced chicken biryani", originalPrice: 15.00, sellingPrice: 7.50, quantity: 10, category: "Hot Meals", image: null, pickupTime: "21:00" },
  { id: "11", name: "Chicken Ceasar Salad", description: "Classic Caesar salad with chicken", originalPrice: 20.00, sellingPrice: 10.00, quantity: 5, category: "Salads", image: null, pickupTime: "20:00" },
  { id: "12", name: "Quinoa Veg Salad", description: "Healthy quinoa and vegetable salad", originalPrice: 15.00, sellingPrice: 7.50, quantity: 0, category: "Salads", image: null, pickupTime: "20:00" },
];

const categories = ["All", "Sandwiches", "Drinks", "Desserts", "Burgers", "Hot Meals", "Salads"];

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = mockMenuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
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
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-3xl">🍽️</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {item.originalPrice > item.sellingPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-primary">
                        ${item.sellingPrice.toFixed(2)}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-sm font-bold",
                      item.quantity > 0 
                        ? "bg-success/10 text-success border-success/20" 
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    )}
                  >
                    {item.quantity > 0 ? `${item.quantity} left` : "Out of stock"}
                  </Badge>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
