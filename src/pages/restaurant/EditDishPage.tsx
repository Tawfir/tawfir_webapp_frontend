import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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

interface Dish {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  discounted_price: number | null;
  co2_saved: number | null;
  availability_method: "pickup";
  pickup_time: string | null;
  quantity: number;
  categories: Array<{ id: number; name: string }>;
}

export default function EditDishPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Dish | null>(null);
  const [availableCategories, setAvailableCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDish();
      fetchCategories();
    }
  }, [id]);

  const fetchDish = async () => {
    try {
      setFetching(true);
      const dishesResponse = await restaurantApi.getDishes();
      if (dishesResponse.status && dishesResponse.data.dishes) {
        const dish = dishesResponse.data.dishes.find((d: Dish) => d.id === parseInt(id!));
        if (dish) {
          setFormData(dish);
        } else {
          toast.error("Dish not found");
          navigate("/restaurant/menu");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load dish");
      navigate("/restaurant/menu");
    } finally {
      setFetching(false);
    }
  };

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

  const handleInputChange = (field: keyof Dish, value: any) => {
    if (!formData) return;
    setFormData((prev) => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleCategoryChange = (categoryName: string) => {
    if (!formData) return;
    const category = availableCategories.find(c => c.name === categoryName);
    if (!category) return;

    setFormData((prev) => {
      if (!prev) return null;
      const categoryIds = prev.categories.map(c => c.id);
      const hasCategory = categoryIds.includes(category.id);
      
      return {
        ...prev,
        categories: hasCategory
          ? prev.categories.filter((c) => c.id !== category.id)
          : [...prev.categories, category],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;

    if (formData.categories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    try {
      setLoading(true);
      
      const categoryIds = formData.categories.map(c => c.id);
      const originalPrice = formData.discounted_price ? formData.price : formData.price;
      const sellingPrice = formData.discounted_price || formData.price;

      await restaurantApi.updateDish(parseInt(id), {
        name: formData.name,
        price: originalPrice,
        discounted_price: formData.discounted_price || undefined,
        co2_saved: formData.co2_saved || undefined,
        description: formData.description || undefined,
        pickup_time: formData.pickup_time || undefined,
        quantity: formData.quantity,
        food_category_ids: categoryIds,
      });

      toast.success("Dish updated successfully!");
      navigate("/restaurant/menu");
    } catch (error: any) {
      toast.error(error.message || "Failed to update dish");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this dish?")) {
      return;
    }

    try {
      await restaurantApi.deleteDish(parseInt(id));
      toast.success("Dish deleted successfully");
      navigate("/restaurant/menu");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete dish");
    }
  };

  if (fetching || !formData) {
    return (
      <DashboardLayout portalType="restaurant">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading dish...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate discount percentage if original price > selling price
  const originalPrice = formData.discounted_price ? formData.price : formData.price;
  const sellingPrice = formData.discounted_price || formData.price;
  const discountPercent = originalPrice > sellingPrice
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
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
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
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
                Edit Dish
              </h1>
            </div>
          </div>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
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
                      value={formData?.name || ""}
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
                      value={formData?.image || null}
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
                      value={formData?.quantity || 0}
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
                          value={originalPrice || ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            handleInputChange("price", val);
                            if (!formData?.discounted_price) {
                              handleInputChange("discounted_price", null);
                            }
                          }}
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
                          value={sellingPrice || ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            if (originalPrice > val) {
                              handleInputChange("discounted_price", val);
                            } else {
                              handleInputChange("discounted_price", null);
                            }
                          }}
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
                      value={formData?.co2_saved || ""}
                      onChange={(e) => handleInputChange("co2_saved", parseFloat(e.target.value) || null)}
                      className="mt-1"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="availabilityMethod">
                      Availability method <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData?.availability_method || "pickup"}
                      onValueChange={(value) => handleInputChange("availability_method", value)}
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
                      value={formData?.description || ""}
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
                      {formData?.categories && formData.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formData.categories.map((category) => (
                            <div
                              key={category.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm"
                            >
                              {category.name}
                              <button
                                type="button"
                                onClick={() => handleCategoryChange(category.name)}
                                className="hover:opacity-70"
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
                          if (value) {
                            handleCategoryChange(value);
                          }
                        }}
                      >
                        <SelectTrigger className="focus:ring-primary">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories
                            .filter((cat) => !formData?.categories.some(c => c.id === cat.id))
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
                        value={formData?.pickup_time || ""}
                        onChange={(e) => handleInputChange("pickup_time", e.target.value)}
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
              {loading ? "Saving..." : "Save changes"}
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
