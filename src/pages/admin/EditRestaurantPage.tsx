import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileUpload } from "@/components/ui/file-upload";
import { ArrowLeft, Trash2, Plus, X } from "lucide-react";

interface WorkingHour {
  day: string;
  open: string;
  close: string;
}

// Mock data - replace with API call
const mockRestaurant = {
  id: 1,
  name: "Tawfir Restaurant",
  address: "123 Test Street",
  latitude: "24.7136",
  longitude: "46.6753",
  publicPhone: "0500000000",
  privatePhone: "0550000000",
  status: "approved",
  isFeatured: true,
  workingHours: [] as WorkingHour[],
  foodCategories: [] as string[],
};

export default function EditRestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: mockRestaurant.name,
    address: mockRestaurant.address,
    latitude: mockRestaurant.latitude,
    longitude: mockRestaurant.longitude,
    publicPhone: mockRestaurant.publicPhone,
    privatePhone: mockRestaurant.privatePhone,
    status: mockRestaurant.status,
    isFeatured: mockRestaurant.isFeatured,
  });

  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(mockRestaurant.workingHours);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [placePics, setPlacePics] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addWorkingHour = () => {
    setWorkingHours([...workingHours, { day: "", open: "", close: "" }]);
  };

  const removeWorkingHour = (index: number) => {
    setWorkingHours(workingHours.filter((_, i) => i !== index));
  };

  const updateWorkingHour = (index: number, field: keyof WorkingHour, value: string) => {
    const updated = [...workingHours];
    updated[index] = { ...updated[index], [field]: value };
    setWorkingHours(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", { ...formData, workingHours });
    navigate("/admin/restaurants");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this restaurant?")) {
      // Handle delete
      navigate("/admin/restaurants");
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
                <Link to="/admin/restaurants">Restaurants</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/admin/restaurants/${id}`}>{formData.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
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
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Edit {formData.name}
              </h1>
            </div>
          </div>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
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
                    />
                  </div>

                  <div>
                    <Label htmlFor="latitude">
                      Latitude <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange("latitude", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Working Hours</Label>
                    <div className="space-y-2 mt-1">
                      {workingHours.map((hour, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Select
                              value={hour.day}
                              onValueChange={(value) => updateWorkingHour(index, "day", value)}
                            >
                              <SelectTrigger className="focus:ring-primary">
                                <SelectValue placeholder="Day" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monday" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Monday</SelectItem>
                                <SelectItem value="tuesday" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Tuesday</SelectItem>
                                <SelectItem value="wednesday" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Wednesday</SelectItem>
                                <SelectItem value="thursday" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Thursday</SelectItem>
                                <SelectItem value="friday" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Friday</SelectItem>
                                <SelectItem value="saturday" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Saturday</SelectItem>
                                <SelectItem value="sunday" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Sunday</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            type="time"
                            value={hour.open}
                            onChange={(e) => updateWorkingHour(index, "open", e.target.value)}
                            className="w-32"
                            placeholder="Open"
                          />
                          <Input
                            type="time"
                            value={hour.close}
                            onChange={(e) => updateWorkingHour(index, "close", e.target.value)}
                            className="w-32"
                            placeholder="Close"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeWorkingHour(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addWorkingHour} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to working Hours
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="publicPhone">
                      Public Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="publicPhone"
                      type="tel"
                      value={formData.publicPhone}
                      onChange={(e) => handleInputChange("publicPhone", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="foodCategories">
                      Food Categories <span className="text-destructive">*</span>
                    </Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="mt-1 focus:ring-primary">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="italian" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Italian</SelectItem>
                        <SelectItem value="mexican" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Mexican</SelectItem>
                        <SelectItem value="asian" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">Asian</SelectItem>
                        <SelectItem value="american" className="focus:bg-primary focus:text-primary-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">American</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <FileUpload
                    value={profilePic}
                    onChange={setProfilePic}
                    label="Profile Picture"
                    previewClassName="h-32 w-32 rounded-full"
                  />

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
                    <Label htmlFor="address">
                      Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="longitude">
                      Longitude <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange("longitude", e.target.value)}
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
                      type="tel"
                      value={formData.privatePhone}
                      onChange={(e) => handleInputChange("privatePhone", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <FileUpload
                    value={coverImage}
                    onChange={setCoverImage}
                    label="Cover Image"
                    previewClassName="h-48"
                  />

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
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <Button type="submit">
              Save changes
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

