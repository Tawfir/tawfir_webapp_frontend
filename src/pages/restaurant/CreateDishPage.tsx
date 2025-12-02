import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Clock } from "lucide-react";
import { restaurantApi, userApi } from "@/services/api";
import { toast } from "sonner";

interface DishFormData {
  name: string;
  description: string;
  image: File | null;
  originalPrice: number;
  sellingPrice: number;
  co2Saved: number;
  availabilityMethod: "pickup";
  pickupTime: string;
  quantity: number;
  categories: string[];
}

export default function CreateDishPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DishFormData>({
    name: "",
    description: "",
    image: null,
    originalPrice: 0,
    sellingPrice: 0,
    co2Saved: 0,
    availabilityMethod: "pickup",
    pickupTime: "",
    quantity: 0,
    categories: [],
  });
  const [availableCategories, setAvailableCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await userApi.getCategories();
      if (response.status && response.data) {
        // Backend returns categories as a direct array, not wrapped in { categories: [...] }
        const categories = Array.isArray(response.data) ? response.data : response.data.categories || [];
        setAvailableCategories(categories);
      }
    } catch (error: any) {
      toast.error("Failed to load categories");
      console.error("Categories fetch error:", error);
    }
  };

  const handleInputChange = (field: keyof DishFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => {
      // Only add if not already present (prevent duplicates)
      if (prev.categories.includes(category)) {
        return prev; // Don't toggle, just return unchanged
      }
      return { ...prev, categories: [...prev.categories, category] };
    });
  };

  const handleRemoveCategory = (category: string) => {
    setFormData((prev) => {
      // Prevent removing if it's the last category
      if (prev.categories.length <= 1) {
        toast.error("At least one category is required");
        return prev;
      }
      return { ...prev, categories: prev.categories.filter((c) => c !== category) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.categories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    if (formData.sellingPrice <= 0) {
      toast.error("Selling price must be greater than 0");
      return;
    }

    if (formData.quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      
      // Map category names to IDs
      const categoryIds = formData.categories
        .map(catName => availableCategories.find(c => c.name === catName)?.id)
        .filter((id): id is number => id !== undefined);

      await restaurantApi.createDish({
        name: formData.name,
        price: formData.originalPrice || formData.sellingPrice,
        discounted_price: formData.originalPrice > formData.sellingPrice ? formData.sellingPrice : undefined,
        co2_saved: formData.co2Saved || undefined,
        description: formData.description || undefined,
        pickup_time: formData.pickupTime || undefined,
        availability_method: formData.availabilityMethod,
        quantity: formData.quantity,
        food_category_ids: categoryIds,
        image: formData.image || undefined,
      });

      toast.success("Dish created successfully!");
      navigate("/restaurant/menu");
    } catch (error: any) {
      toast.error(error.message || "Failed to create dish");
    } finally {
      setLoading(false);
    }
  };


  // Calculate discount percentage if original price > selling price
  const discountPercent = formData.originalPrice > formData.sellingPrice
    ? Math.round(((formData.originalPrice - formData.sellingPrice) / formData.originalPrice) * 100)
    : 0;

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
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/restaurant/menu")}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Create Dish
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
            {/* Left Column */}
            <div className="space-y-6 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
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
                      placeholder="Enter dish name"
                    />
                  </div>

                  <div>
                    <Label>
                      Image <span className="text-destructive">*</span>
                    </Label>
                    <FileUpload
                      value={formData.image}
                      onChange={(file) => handleInputChange("image", file)}
                      accept="image/*"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity">
                      Quantity <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity || ""}
                      onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
                      className="mt-1"
                      required
                      placeholder="How many items available?"
                    />
                  </div>

                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
                    <div>
                      <Label htmlFor="originalPrice">
                        Original Price
                        <span className="text-xs text-muted-foreground ml-2">(Optional - to show discount)</span>
                      </Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={formData.originalPrice || ""}
                          onChange={(e) => handleInputChange("originalPrice", parseFloat(e.target.value) || 0)}
                          className="pl-7"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sellingPrice">
                        Selling Price <span className="text-destructive">*</span>
                        <span className="text-xs text-muted-foreground ml-2">(What customers pay)</span>
                      </Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="sellingPrice"
                          type="number"
                          step="0.01"
                          value={formData.sellingPrice || ""}
                          onChange={(e) => handleInputChange("sellingPrice", parseFloat(e.target.value) || 0)}
                          className="pl-7"
                          required
                          placeholder="0.00"
                        />
                      </div>
                      {discountPercent > 0 && (
                        <p className="text-xs text-success mt-1">
                          {discountPercent}% discount applied
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="co2Saved">CO2 Saved (kg)</Label>
                    <Input
                      id="co2Saved"
                      type="number"
                      step="0.01"
                      value={formData.co2Saved || ""}
                      onChange={(e) => handleInputChange("co2Saved", parseFloat(e.target.value) || 0)}
                      className="mt-1"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="availabilityMethod">
                      Availability method <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.availabilityMethod}
                      onValueChange={(value) => handleInputChange("availabilityMethod", value)}
                    >
                      <SelectTrigger className="mt-1 focus:ring-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="pickup"
                          className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                        >
                          PICKUP
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-1"
                      placeholder="Enter dish description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="categories">
                      Categories <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-2 space-y-3">
                      {formData.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formData.categories.map((category) => (
                            <div
                              key={category}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm"
                            >
                              {category}
                              <button
                                type="button"
                                onClick={() => handleRemoveCategory(category)}
                                className="hover:opacity-70 focus:outline-none"
                                aria-label={`Remove ${category} category`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Select
                        value=""
                        onValueChange={(value) => {
                          if (value && !formData.categories.includes(value)) {
                            handleCategoryChange(value);
                          }
                        }}
                      >
                        <SelectTrigger className="focus:ring-primary">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories
                            .filter((cat) => !formData.categories.includes(cat.name))
                            .map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                                className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pickupTime">
                      Pickup Time <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="pickupTime"
                        type="time"
                        value={formData.pickupTime}
                        onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                        required
                        className="pr-10"
                      />
                      <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary pointer-events-none z-10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/restaurant/menu">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
