import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { ArrowLeft, Edit, MapPin, Phone, User, CheckCircle2, XCircle } from "lucide-react";

interface WorkingHour {
  day: string;
  open: string;
  close: string;
}

interface Restaurant {
  id: number;
  name: string;
  owner: string;
  address: string;
  publicPhone: string;
  privatePhone: string;
  latitude: string;
  longitude: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  profilePic?: string;
  coverImage?: string;
  placePics?: string[];
  workingHours?: WorkingHour[];
  categories?: string[];
}

// Mock data - replace with API call
const mockRestaurant: Restaurant = {
  id: 1,
  name: "Tawfir Restaurant",
  owner: "Restaurant Owner",
  address: "123 Test Street",
  publicPhone: "0500000000",
  privatePhone: "0550000000",
  latitude: "24.7136",
  longitude: "46.6753",
  status: "approved",
  isFeatured: true,
  workingHours: [],
  categories: [],
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

export default function ViewRestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const restaurant = mockRestaurant; // In real app, fetch by id

  const status = statusConfig[restaurant.status];

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
              <BreadcrumbPage>View</BreadcrumbPage>
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
                View {restaurant.name}
              </h1>
            </div>
          </div>
          <Button asChild>
            <Link to={`/admin/restaurants/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>

        {/* Restaurant Information */}
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                  <p className="text-base font-semibold text-foreground">{restaurant.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Owner</p>
                  <p className="text-base font-semibold text-foreground">{restaurant.owner}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Private Phone</p>
                  <p className="text-base font-semibold text-foreground">{restaurant.privatePhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Featured</p>
                  {restaurant.isFeatured ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-base font-semibold text-foreground">Yes</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="text-base font-semibold text-foreground">No</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                  <p className="text-base font-semibold text-foreground">{restaurant.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Public Phone</p>
                  <p className="text-base font-semibold text-foreground">{restaurant.publicPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <Badge className={cn("font-medium text-xs uppercase tracking-wide", status.className)}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Latitude</p>
                <p className="text-base font-semibold text-foreground">{restaurant.latitude}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Longitude</p>
                <p className="text-base font-semibold text-foreground">{restaurant.longitude}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Profile Picture</p>
                {restaurant.profilePic ? (
                  <img src={restaurant.profilePic} alt="Profile" className="h-32 w-32 rounded-lg object-cover" />
                ) : (
                  <p className="text-sm text-muted-foreground">No profile picture</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Cover Image</p>
                {restaurant.coverImage ? (
                  <img src={restaurant.coverImage} alt="Cover" className="h-48 w-full rounded-lg object-cover" />
                ) : (
                  <p className="text-sm text-muted-foreground">No cover image</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Place Pictures</p>
                {restaurant.placePics && restaurant.placePics.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {restaurant.placePics.map((pic, index) => (
                      <img key={index} src={pic} alt={`Place ${index + 1}`} className="h-32 w-full rounded-lg object-cover" />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No place pictures</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
          </CardHeader>
          <CardContent>
            {restaurant.workingHours && restaurant.workingHours.length > 0 ? (
              <div className="space-y-2">
                {restaurant.workingHours.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <span className="font-medium text-foreground capitalize">{hour.day}</span>
                    <span className="text-sm text-muted-foreground">
                      {hour.open} - {hour.close}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No working hours set</p>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {restaurant.categories && restaurant.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {restaurant.categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {category}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No categories</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

