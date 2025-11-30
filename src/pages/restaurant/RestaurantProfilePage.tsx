import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { MapPin, Plus, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkingHour {
  day: string;
  open: string;
  close: string;
}

const mockRestaurant = {
  name: "Tawfir Restaurant",
  address: "123 Test Street",
  lat: "24.7136",
  lng: "46.6753",
  payoutMethod: "manual",
  publicPhone: "0500000000",
  privatePhone: "0550000000",
  workingHours: [
    { day: "monday", open: "09:00", close: "22:00" },
    { day: "tuesday", open: "09:00", close: "22:00" },
    { day: "wednesday", open: "09:00", close: "22:00" },
    { day: "thursday", open: "09:00", close: "22:00" },
    { day: "friday", open: "09:00", close: "22:00" },
    { day: "saturday", open: "10:00", close: "23:00" },
    { day: "sunday", open: "10:00", close: "23:00" },
  ] as WorkingHour[],
  foodCategoryIds: [1, 2],
  profilePic: null as string | null,
  placePics: [] as string[],
  coverImage: null as string | null,
};

const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const mockFoodCategories = [
  { id: 1, name: "Burgers" },
  { id: 2, name: "Salads & Bowls" },
  { id: 3, name: "Drinks" },
  { id: 4, name: "Desserts" },
  { id: 5, name: "Hot Meals" },
  { id: 6, name: "Sandwiches & Wraps" },
];

export default function RestaurantProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: mockRestaurant.name,
    address: mockRestaurant.address,
    lat: mockRestaurant.lat,
    lng: mockRestaurant.lng,
    payoutMethod: mockRestaurant.payoutMethod,
    publicPhone: mockRestaurant.publicPhone,
    privatePhone: mockRestaurant.privatePhone,
    workingHours: [...mockRestaurant.workingHours],
    foodCategoryIds: [...mockRestaurant.foodCategoryIds],
    profilePic: mockRestaurant.profilePic,
    placePics: [...mockRestaurant.placePics],
    coverImage: mockRestaurant.coverImage,
  });

  const handleInputChange = (field: string, value: string | string[] | WorkingHour[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      // For demo, convert File to URL. In real app, upload and get URL.
      const url = URL.createObjectURL(file);
      if (field === "placePics") {
        setFormData((prev) => ({
          ...prev,
          placePics: [...prev.placePics, url],
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: url }));
      }
    }
  };

  const handleRemovePlacePic = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      placePics: prev.placePics.filter((_, i) => i !== index),
    }));
  };

  const handleAddWorkingHour = () => {
    setFormData((prev) => ({
      ...prev,
      workingHours: [
        ...prev.workingHours,
        { day: "monday", open: "09:00", close: "22:00" },
      ],
    }));
  };

  const handleRemoveWorkingHour = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: prev.workingHours.filter((_, i) => i !== index),
    }));
  };

  const handleWorkingHourChange = (
    index: number,
    field: keyof WorkingHour,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.workingHours];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workingHours: updated };
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          alert(`Geolocation failed: ${error.message}`);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Implement API call to save restaurant profile
  };

  return (
    <DashboardLayout portalType="restaurant">
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/restaurant/profile">Restaurant Profile</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Restaurant Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
            {/* Left Column */}
            <div className="space-y-6 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Restaurant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div>
                    <Label htmlFor="name">
                      Restaurant Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">
                      Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Use location</Label>
                    <Button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="w-full mt-1"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Use my current location
                    </Button>
                  </div>

                  <div>
                    <Label>Pick on Map</Label>
                    <div className="mt-1 h-64 rounded-lg border border-border bg-muted/30 flex items-center justify-center">
                      <div className="text-center text-muted-foreground p-4">
                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Google Maps integration required
                        </p>
                        <p className="text-xs mt-1">
                          Lat: {formData.lat}, Lng: {formData.lng}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lat">
                        Latitude <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={formData.lat}
                        onChange={(e) => handleInputChange("lat", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lng">
                        Longitude <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        value={formData.lng}
                        onChange={(e) => handleInputChange("lng", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payoutMethod">
                      Payout Method <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.payoutMethod}
                      onValueChange={(value) => handleInputChange("payoutMethod", value)}
                    >
                      <SelectTrigger className="mt-1 focus:ring-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="manual"
                          className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                        >
                          Manual Bank Transfer
                        </SelectItem>
                        <SelectItem
                          value="stripe"
                          className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                        >
                          Stripe Connect
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="publicPhone">
                      Public Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="publicPhone"
                      value={formData.publicPhone}
                      onChange={(e) => handleInputChange("publicPhone", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="privatePhone">
                      Private Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="privatePhone"
                      value={formData.privatePhone}
                      onChange={(e) => handleInputChange("privatePhone", e.target.value)}
                      required
                      className="mt-1"
                    />
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
                    <Label>Working Hours</Label>
                    <div className="mt-1 space-y-3">
                      {formData.workingHours.map((hour, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30"
                        >
                          <Select
                            value={hour.day}
                            onValueChange={(value) =>
                              handleWorkingHourChange(index, "day", value)
                            }
                          >
                            <SelectTrigger className="flex-1 focus:ring-primary">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {daysOfWeek.map((day) => (
                                <SelectItem
                                  key={day.value}
                                  value={day.value}
                                  className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                                >
                                  {day.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="time"
                            value={hour.open}
                            onChange={(e) =>
                              handleWorkingHourChange(index, "open", e.target.value)
                            }
                            className="w-32"
                          />
                          <Input
                            type="time"
                            value={hour.close}
                            onChange={(e) =>
                              handleWorkingHourChange(index, "close", e.target.value)
                            }
                            className="w-32"
                          />
                          {formData.workingHours.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveWorkingHour(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddWorkingHour}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to working Hours
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="foodCategories">
                      Food Categories <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.foodCategoryIds[0]?.toString()}
                      onValueChange={(value) => {
                        const ids = formData.foodCategoryIds.includes(parseInt(value))
                          ? formData.foodCategoryIds
                          : [...formData.foodCategoryIds, parseInt(value)];
                        handleInputChange("foodCategoryIds", ids);
                      }}
                    >
                      <SelectTrigger className="mt-1 focus:ring-primary">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockFoodCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                            className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.foodCategoryIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.foodCategoryIds.map((id) => {
                          const category = mockFoodCategories.find((c) => c.id === id);
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-sm"
                            >
                              {category?.name}
                              <button
                                type="button"
                                onClick={() => {
                                  handleInputChange(
                                    "foodCategoryIds",
                                    formData.foodCategoryIds.filter((i) => i !== id)
                                  );
                                }}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <FileUpload
                      label="Profile Picture"
                      value={formData.profilePic}
                      onChange={(file) => handleFileChange("profilePic", file)}
                      accept="image/*"
                    />
                  </div>

                  <div>
                    <Label>Place Pictures</Label>
                    <div className="mt-1 space-y-2">
                      {formData.placePics.map((pic, index) => (
                        <div key={index} className="relative">
                          <img
                            src={pic}
                            alt={`Place ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemovePlacePic(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.placePics.length < 5 && (
                        <FileUpload
                          value={null}
                          onChange={(file) => handleFileChange("placePics", file)}
                          accept="image/*"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <FileUpload
                      label="Cover Image"
                      value={formData.coverImage}
                      onChange={(file) => handleFileChange("coverImage", file)}
                      accept="image/*"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <Button type="submit">Save changes</Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/restaurant">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
