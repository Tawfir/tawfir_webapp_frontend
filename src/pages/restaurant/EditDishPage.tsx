import { useState } from "react";
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

interface Dish {
  id: string;
  name: string;
  description: string;
  image: string | null;
  originalPrice: number;
  sellingPrice: number;
  co2Saved: number;
  availabilityMethod: "pickup";
  pickupTime: string;
  quantity: number;
  categories: string[];
}

const mockDish: Dish = {
  id: "1",
  name: "Chicken Sandwhich",
  description: "Enter dish description",
  image: null,
  originalPrice: 10.00,
  sellingPrice: 5.00,
  co2Saved: 4.40,
  availabilityMethod: "pickup",
  pickupTime: "22:00",
  quantity: 5,
  categories: ["Burgers"],
};

const mockCategories = ["Burgers", "Sandwiches", "Drinks", "Desserts", "Hot Meals", "Salads"];

export default function EditDishPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Dish>(mockDish);

  const handleInputChange = (field: keyof Dish, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    navigate("/restaurant/menu");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      console.log("Deleting dish:", id);
      navigate("/restaurant/menu");
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
                      value={formData.quantity}
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
                          value={formData.originalPrice}
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
                          value={formData.sellingPrice}
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
                      value={formData.co2Saved}
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
                                onClick={() => handleCategoryChange(category)}
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
                          if (value && !formData.categories.includes(value)) {
                            handleCategoryChange(value);
                          }
                        }}
                      >
                        <SelectTrigger className="focus:ring-primary">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCategories
                            .filter((cat) => !formData.categories.includes(cat))
                            .map((category) => (
                              <SelectItem
                                key={category}
                                value={category}
                                className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                              >
                                {category}
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
            <Button type="submit">Save changes</Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/restaurant/menu">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
