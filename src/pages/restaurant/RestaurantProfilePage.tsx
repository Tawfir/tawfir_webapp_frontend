import { useState, useEffect } from "react";
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
import { restaurantApi, userApi } from "@/services/api";
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

export default function RestaurantProfilePage() {
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
  });
  const [availableCategories, setAvailableCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [placePicFiles, setPlacePicFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchRestaurant();
    fetchCategories();
  }, []);

  const fetchRestaurant = async () => {
    try {
      setFetching(true);
      const response = await restaurantApi.getRestaurant();
      if (response.status && response.data) {
        const restaurant = response.data;
        const workingHours = restaurant.working_hours 
          ? (typeof restaurant.working_hours === 'string' 
              ? JSON.parse(restaurant.working_hours) 
              : restaurant.working_hours)
          : [];
        
        setFormData({
          name: restaurant.name || "",
          address: restaurant.address || "",
          lat: restaurant.lat?.toString() || "",
          lng: restaurant.lng?.toString() || "",
          publicPhone: restaurant.public_phone || "",
          privatePhone: restaurant.private_phone || "",
          workingHours: Array.isArray(workingHours) ? workingHours : [],
          foodCategoryIds: restaurant.categories?.map((c: any) => Number(c.id)) || [],
          profilePic: restaurant.profile_pic || null,
          placePics: Array.isArray(restaurant.place_pics) ? restaurant.place_pics : (restaurant.place_pics ? [restaurant.place_pics] : []),
          coverImage: restaurant.cover_image || null,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load restaurant profile");
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
        // Ensure all category IDs are numbers for consistent comparison
        const normalizedCategories = categories.map((cat: any) => ({
          ...cat,
          id: Number(cat.id)
        }));
        setAvailableCategories(normalizedCategories);
      }
    } catch (error: any) {
      toast.error("Failed to load categories");
      console.error("Categories fetch error:", error);
    }
  };

  const handleInputChange = (field: string, value: string | string[] | WorkingHour[] | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      // For demo, convert File to URL. In real app, upload and get URL.
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
      } else {
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

  const handleRemovePlacePic = async (index: number) => {
    // Check if it's an existing image (not a blob URL) - if so, delete from server
    const pic = formData.placePics[index];
    const isExistingImage = pic && !pic.startsWith('blob:');
    
    if (isExistingImage) {
      if (!window.confirm("Are you sure you want to delete this place picture?")) {
        return; // Don't remove if user cancels
      }
      try {
        setLoading(true);
        // Find the index in the original array (excluding new blob URLs)
        const existingPics = formData.placePics.filter(p => !p.startsWith('blob:'));
        const originalIndex = existingPics.findIndex(p => p === pic);
        
        if (originalIndex !== -1) {
          await restaurantApi.deletePlacePic(originalIndex);
          toast.success("Place picture deleted successfully");
        }
        // Only remove from UI after successful deletion
        setFormData((prev) => ({
          ...prev,
          placePics: prev.placePics.filter((_, i) => i !== index),
        }));
      } catch (error: any) {
        toast.error(error.message || "Failed to delete place picture");
        // Don't remove from UI if deletion failed
      } finally {
        setLoading(false);
      }
    } else {
      // Remove from both the preview URLs and the file array for new uploads
      // If it's a new file (index >= existing placePics count), remove from placePicFiles
      const existingPicsCount = formData.placePics.filter(pic => !pic.startsWith('blob:')).length;
      if (index >= existingPicsCount) {
        const fileIndex = index - existingPicsCount;
        setPlacePicFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      }
      // Remove from UI for new uploads
      setFormData((prev) => ({
        ...prev,
        placePics: prev.placePics.filter((_, i) => i !== index),
      }));
    }
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
          
          // Reverse geocode to get address
          try {
            // We'll use the map component's geocoding, but for now just update lat/lng
            setFormData((prev) => ({
              ...prev,
              lat: lat.toString(),
              lng: lng.toString(),
            }));
            toast.success("Location updated from your current position");
          } catch (error) {
            toast.error("Failed to get address for location");
          }
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
      address: address || prev.address, // Only update address if geocoding succeeded
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.lat || !formData.lng) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const workingHoursObj: Record<string, { open: string; close: string }> = {};
      formData.workingHours.forEach(wh => {
        workingHoursObj[wh.day] = { open: wh.open, close: wh.close };
      });

      await restaurantApi.updateRestaurant({
        restaurant_name: formData.name,
        address: formData.address,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        public_phone: formData.publicPhone || undefined,
        private_phone: formData.privatePhone || undefined,
        working_hours: workingHoursObj,
        food_category_ids: formData.foodCategoryIds,
        profile_pic: profilePicFile || undefined,
        cover_image: coverImageFile || undefined,
        place_pics: placePicFiles.length > 0 ? placePicFiles : undefined,
      });

      toast.success("Restaurant profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update restaurant profile");
    } finally {
      setLoading(false);
    }
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

        {fetching ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading restaurant profile...</p>
          </div>
        ) : (
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
                          // Ensure we compare IDs as numbers to avoid type mismatch
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
                    <Label>Profile Picture</Label>
                    <FileUpload
                      label=""
                      value={formData.profilePic}
                      onChange={(file) => handleFileChange("profilePic", file)}
                      onRemove={async () => {
                        // If it's an existing image (not a new file upload), delete from server
                        if (formData.profilePic && !profilePicFile && !formData.profilePic.startsWith('blob:')) {
                          if (!window.confirm("Are you sure you want to delete the profile picture?")) {
                            return false; // Return false to prevent removal
                          }
                          try {
                            setLoading(true);
                            await restaurantApi.deleteProfilePic();
                            toast.success("Profile picture deleted successfully");
                            setFormData(prev => ({ ...prev, profilePic: null }));
                            return true; // Allow removal
                          } catch (error: any) {
                            toast.error(error.message || "Failed to delete profile picture");
                            return false; // Don't remove from UI if deletion failed
                          } finally {
                            setLoading(false);
                          }
                        } else {
                          // Just remove the new file upload
                          setProfilePicFile(null);
                          setFormData(prev => ({ ...prev, profilePic: null }));
                          return true; // Allow removal
                        }
                      }}
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
                      onRemove={async () => {
                        // If it's an existing image (not a new file upload), delete from server
                        if (formData.coverImage && !coverImageFile && !formData.coverImage.startsWith('blob:')) {
                          if (!window.confirm("Are you sure you want to delete the cover image?")) {
                            return false; // Return false to prevent removal
                          }
                          try {
                            setLoading(true);
                            await restaurantApi.deleteCoverImage();
                            toast.success("Cover image deleted successfully");
                            setFormData(prev => ({ ...prev, coverImage: null }));
                            return true; // Allow removal
                          } catch (error: any) {
                            toast.error(error.message || "Failed to delete cover image");
                            return false; // Don't remove from UI if deletion failed
                          } finally {
                            setLoading(false);
                          }
                        } else {
                          // Just remove the new file upload
                          setCoverImageFile(null);
                          setFormData(prev => ({ ...prev, coverImage: null }));
                          return true; // Allow removal
                        }
                      }}
                      accept="image/*"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <Button type="submit" disabled={loading || fetching}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/restaurant">Cancel</Link>
            </Button>
          </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
