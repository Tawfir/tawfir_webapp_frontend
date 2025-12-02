import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
import { ArrowLeft, Plus, X, MapPin } from "lucide-react";
import { adminApi, userApi } from "@/services/api";
import { toast } from "sonner";
import GoogleMapPicker from "@/components/maps/GoogleMapPicker";

interface WorkingHour {
  day: string;
  open: string;
  close: string;
}

const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export default function NewRestaurantPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lat: "",
    lng: "",
    publicPhone: "",
    privatePhone: "",
    workingHours: [] as WorkingHour[],
    foodCategoryIds: [] as number[],
    profilePic: null as string | null,
    placePics: [] as string[],
    coverImage: null as string | null,
    status: "pending" as "pending" | "approved" | "rejected",
    isFeatured: false,
    ownerEmail: "",
    ownerName: "",
    ownerPassword: "",
  });
  const [availableCategories, setAvailableCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [placePicFiles, setPlacePicFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await userApi.getCategories();
      if (response.status && response.data) {
        const categories = Array.isArray(response.data) ? response.data : response.data.categories || [];
        const normalizedCategories = categories.map((cat: any) => ({
          ...cat,
          id: Number(cat.id)
        }));
        setAvailableCategories(normalizedCategories);
      }
    } catch (error: any) {
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (field: string, value: string | string[] | WorkingHour[] | number[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      if (field === "placePics") {
        setPlacePicFiles((prev) => [...prev, file]);
        setFormData((prev) => ({
          ...prev,
          placePics: [...prev.placePics, url],
        }));
      } else if (field === "profilePic") {
        setProfilePicFile(file);
        setFormData((prev) => ({ ...prev, [field]: url }));
      } else if (field === "coverImage") {
        setCoverImageFile(file);
        setFormData((prev) => ({ ...prev, [field]: url }));
      }
    } else {
      if (field === "profilePic") {
        setProfilePicFile(null);
      } else if (field === "coverImage") {
        setCoverImageFile(null);
      }
      setFormData((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleRemovePlacePic = (index: number) => {
    const existingPicsCount = formData.placePics.filter(pic => !pic.startsWith('blob:')).length;
    if (index >= existingPicsCount) {
      const fileIndex = index - existingPicsCount;
      setPlacePicFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
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
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData((prev) => ({
            ...prev,
            lat: lat.toString(),
            lng: lng.toString(),
          }));
          toast.success("Location updated from your current position");
        },
        (error) => {
          toast.error(`Geolocation failed: ${error.message}`);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleMapLocationChange = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({
      ...prev,
      lat: lat.toString(),
      lng: lng.toString(),
      address: address || prev.address,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      lat: "",
      lng: "",
      publicPhone: "",
      privatePhone: "",
      workingHours: [],
      foodCategoryIds: [],
      profilePic: null,
      placePics: [],
      coverImage: null,
      status: "pending",
      isFeatured: false,
      ownerEmail: "",
      ownerName: "",
      ownerPassword: "",
    });
    setProfilePicFile(null);
    setCoverImageFile(null);
    setPlacePicFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent, createAnother: boolean = false) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.lat || !formData.lng) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.ownerEmail || !formData.ownerName || !formData.ownerPassword) {
      toast.error("Please fill in all owner information fields");
      return;
    }

    try {
      setLoading(true);
      
      const workingHoursObj: Record<string, { open: string; close: string }> = {};
      formData.workingHours.forEach(wh => {
        workingHoursObj[wh.day] = { open: wh.open, close: wh.close };
      });

      await adminApi.createRestaurant({
        restaurant_name: formData.name,
        address: formData.address,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        public_phone: formData.publicPhone || undefined,
        private_phone: formData.privatePhone || undefined,
        working_hours: workingHoursObj,
        food_category_ids: formData.foodCategoryIds,
        status: formData.status,
        is_featured: formData.isFeatured,
        owner_email: formData.ownerEmail,
        owner_name: formData.ownerName,
        owner_password: formData.ownerPassword,
        profile_pic: profilePicFile || undefined,
        cover_image: coverImageFile || undefined,
        place_pics: placePicFiles.length > 0 ? placePicFiles : undefined,
      });

      toast.success("Restaurant created successfully!");
      
      if (createAnother) {
        resetForm();
      } else {
        navigate("/admin/restaurants");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/restaurants">Restaurants</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/restaurants")}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Create Restaurant
            </h1>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e, false); }}>
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
                      placeholder="Enter address or search for location"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can also search by clicking on the map below
                    </p>
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
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      Click on the map or drag the marker to set your restaurant location
                    </p>
                    <div className="mt-1">
                      <GoogleMapPicker
                        lat={formData.lat ? parseFloat(formData.lat) : null}
                        lng={formData.lng ? parseFloat(formData.lng) : null}
                        onLocationChange={handleMapLocationChange}
                        height="400px"
                      />
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
                    <Label htmlFor="publicPhone">Public Phone</Label>
                    <Input
                      id="publicPhone"
                      value={formData.publicPhone}
                      onChange={(e) => handleInputChange("publicPhone", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="privatePhone">Private Phone</Label>
                    <Input
                      id="privatePhone"
                      value={formData.privatePhone}
                      onChange={(e) => handleInputChange("privatePhone", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">
                      Approval Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="mt-1 focus:ring-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Pending</SelectItem>
                        <SelectItem value="approved" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Approved</SelectItem>
                        <SelectItem value="rejected" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <Label htmlFor="featured" className="cursor-pointer">
                        Featured
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Highlight this restaurant on the home page
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
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
                      value=""
                      onValueChange={(value) => {
                        const id = parseInt(value);
                        if (!formData.foodCategoryIds.includes(id)) {
                          handleInputChange("foodCategoryIds", [...formData.foodCategoryIds, id]);
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1 focus:ring-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories
                          .filter(cat => !formData.foodCategoryIds.includes(Number(cat.id)))
                          .map((category) => (
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
                          const category = availableCategories.find((c) => Number(c.id) === Number(id));
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-sm"
                            >
                              <span>{category?.name || `Category ${id}`}</span>
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
                    <Label htmlFor="ownerName">
                      Owner Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange("ownerName", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ownerEmail">
                      Owner Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ownerPassword">
                      Owner Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ownerPassword"
                      type="password"
                      value={formData.ownerPassword}
                      onChange={(e) => handleInputChange("ownerPassword", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Profile Picture</Label>
                    <FileUpload
                      label=""
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
                    <Label>Cover Image</Label>
                    <FileUpload
                      label=""
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
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/restaurants">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
