import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowLeft, Utensils, Store, DollarSign, Trash2 } from "lucide-react";
import { adminApi } from "@/services/api";
import { toast } from "sonner";


interface Restaurant {
  id: number;
  name: string;
  address?: string;
  status: "pending" | "approved" | "rejected";
}

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

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    image: null as string | null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [dishCount, setDishCount] = useState<number>(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setFetching(true);
      if (!id) {
        toast.error("Category ID is required");
        navigate("/admin/categories");
        return;
      }

      const categoryId = parseInt(id);
      if (isNaN(categoryId)) {
        toast.error("Invalid category ID");
        navigate("/admin/categories");
        return;
      }

      const response = await adminApi.getCategory(categoryId);
      if (response.status && response.data?.category) {
        const category = response.data.category;
        setFormData({
          name: category.name || "",
          image: category.image || null,
        });
        // Set dish count and restaurants
        setDishCount(category.dish_count || 0);
        setRestaurants(category.restaurants || []);
      } else {
        toast.error(response.message || "Category not found");
        navigate("/admin/categories");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load category");
      navigate("/admin/categories");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, image: "" }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const response = await adminApi.updateCategory(parseInt(id!), {
        name: formData.name.trim(),
        image: imageFile || undefined,
      });

      if (response.status) {
        toast.success("Category updated successfully!");
        navigate("/admin/categories");
      } else {
        toast.error(response.message || "Failed to update category");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm(`Are you sure you want to delete "${formData.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      await adminApi.deleteCategory(parseInt(id));
      toast.success("Category deleted successfully");
      navigate("/admin/categories");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

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
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/categories")}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Edit Food Category
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-1"
                      disabled={fetching}
                    />
                  </div>


                  <div>
                    <Label>Category Image</Label>
                    <FileUpload
                      value={formData.image || imageFile || null}
                      onChange={handleImageChange}
                      onRemove={async () => {
                        // If it's an existing image (not a new file upload), delete from server
                        if (formData.image && !imageFile && id && !formData.image.startsWith('blob:')) {
                          if (!window.confirm("Are you sure you want to delete this image?")) {
                            return false; // Return false to prevent removal
                          }
                          try {
                            setLoading(true);
                            await adminApi.deleteCategoryImage(parseInt(id));
                            toast.success("Image deleted successfully");
                            setFormData(prev => prev ? { ...prev, image: null } : null);
                            setImageFile(null);
                            return true; // Allow removal
                          } catch (error: any) {
                            toast.error(error.message || "Failed to delete image");
                            return false; // Don't remove from UI if deletion failed
                          } finally {
                            setLoading(false);
                          }
                        } else {
                          // Just remove the new file upload
                          setImageFile(null);
                          setFormData(prev => prev ? { ...prev, image: "" } : null);
                          return true; // Allow removal
                        }
                      }}
                      label=""
                      previewClassName="h-48"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Dishes Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    Dishes in this Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Utensils className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-2">{dishCount}</p>
                    <p className="text-sm text-muted-foreground">
                      {dishCount === 1 ? 'Dish' : 'Dishes'} in this category
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Restaurants Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    Restaurants with this Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {restaurants.length > 0 ? (
                    <div className="space-y-3">
                      {restaurants.map((restaurant, index) => {
                        const status = statusConfig[restaurant.status];
                        return (
                          <div
                            key={restaurant.id}
                            className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{restaurant.name}</p>
                              <p className="text-sm text-muted-foreground truncate">{restaurant.address}</p>
                            </div>
                            <Badge className={cn("font-medium text-xs uppercase tracking-wide", status.className)}>
                              {status.label}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Store className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No restaurants with this category</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <Button type="submit" disabled={loading || fetching}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/categories">Cancel</Link>
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting || fetching}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Deleting..." : "Delete Category"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

