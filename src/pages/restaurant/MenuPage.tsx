import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Copy } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
  image: string;
}

const mockMenuItems: MenuItem[] = [
  { id: "1", name: "Margherita Pizza", description: "Fresh tomatoes, mozzarella, basil", price: "$18.99", category: "Pizza", available: true, image: "🍕" },
  { id: "2", name: "Pepperoni Pizza", description: "Classic pepperoni with cheese blend", price: "$20.99", category: "Pizza", available: true, image: "🍕" },
  { id: "3", name: "Hawaiian Pizza", description: "Ham, pineapple, mozzarella", price: "$19.99", category: "Pizza", available: true, image: "🍕" },
  { id: "4", name: "Veggie Supreme", description: "Bell peppers, mushrooms, olives, onions", price: "$21.99", category: "Pizza", available: false, image: "🍕" },
  { id: "5", name: "Garlic Bread", description: "Crispy bread with garlic butter", price: "$6.99", category: "Sides", available: true, image: "🥖" },
  { id: "6", name: "Caesar Salad", description: "Romaine, parmesan, croutons", price: "$12.99", category: "Salads", available: true, image: "🥗" },
  { id: "7", name: "Buffalo Wings", description: "Spicy chicken wings with ranch", price: "$14.99", category: "Sides", available: true, image: "🍗" },
  { id: "8", name: "Tiramisu", description: "Classic Italian dessert", price: "$8.99", category: "Desserts", available: true, image: "🍰" },
];

const categories = ["All", "Pizza", "Sides", "Salads", "Desserts"];

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
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Menu</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your restaurant's menu items
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Search and Categories */}
        <div className="space-y-4 animate-slide-up">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
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
                "group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in",
                !item.available && "opacity-60"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-3xl">
                    {item.image}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Item
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{item.price}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                    <Switch checked={item.available} />
                  </div>
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
