import { useState, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Utensils, Store } from "lucide-react";
import { userApi } from "@/services/api";
import { toast } from "sonner";

interface FoodCategory {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  cover?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await userApi.getCategories();
      if (response.status && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.slug && category.slug.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/categories">Food Categories</Link>
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Food Categories</h1>
            <p className="mt-1 text-muted-foreground">
              Manage food categories for the platform
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New food category
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/admin/categories/${category.id}/edit`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in cursor-pointer block"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {category.image || category.cover ? (
                  <img
                    src={category.image || category.cover}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Utensils className="h-12 w-12 text-primary/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Category Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
                      {category.name}
                    </h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/categories/${category.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          // Handle delete
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats - Note: Counts would need to be calculated from API */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Utensils className="h-4 w-4" />
                    <span className="text-xs">Category</span>
                  </div>
                </div>
              </div>

              {/* Hover Gradient Border */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCategories.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground mb-1">No categories found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try adjusting your search query" : "Get started by creating a new category"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
