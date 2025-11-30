import { useState } from "react";
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
import { ArrowLeft, Utensils, Store, DollarSign } from "lucide-react";

interface Dish {
  id: number;
  name: string;
  price: number;
  restaurant: string;
  image?: string;
}

interface Restaurant {
  id: number;
  name: string;
  address: string;
  status: "pending" | "approved" | "rejected";
}

// Mock data - replace with API call
const mockCategory = {
  id: 1,
  name: "Burgers",
  image: "/placeholder.svg",
  dishes: [
    { id: 1, name: "Classic Burger", price: 12.50, restaurant: "Tawfir Restaurant", image: "/placeholder.svg" },
    { id: 2, name: "Cheese Burger", price: 14.00, restaurant: "Tawfir Restaurant", image: "/placeholder.svg" },
  ] as Dish[],
  restaurants: [
    { id: 1, name: "Tawfir Restaurant", address: "123 Test Street", status: "approved" as const },
  ] as Restaurant[],
};

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
    name: mockCategory.name,
    image: mockCategory.image,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    navigate("/admin/categories");
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
                    />
                  </div>

                  <FileUpload
                    value={formData.image || imageFile}
                    onChange={handleImageChange}
                    label="Category Image"
                    previewClassName="h-48"
                  />
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
                  {mockCategory.dishes.length > 0 ? (
                    <div className="space-y-3">
                      {mockCategory.dishes.map((dish, index) => (
                        <div
                          key={dish.id}
                          className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {dish.image && (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{dish.name}</p>
                            <p className="text-sm text-muted-foreground">{dish.restaurant}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">${dish.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No dishes in this category</p>
                    </div>
                  )}
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
                  {mockCategory.restaurants.length > 0 ? (
                    <div className="space-y-3">
                      {mockCategory.restaurants.map((restaurant, index) => {
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
            <Button type="submit">
              Save changes
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/categories">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

