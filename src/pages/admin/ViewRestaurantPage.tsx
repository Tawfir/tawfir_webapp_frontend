import { useState, useEffect } from "react";
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
import { ArrowLeft, Edit, CheckCircle2, XCircle, User, Mail, Phone, Trash2 } from "lucide-react";
import { adminApi } from "@/services/api";
import { toast } from "sonner";

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

const statusConfig = {
  pending: { 
    label: "PENDING", 
    className: "bg-warning/10 text-warning border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
  approved: { 
    label: "APPROVED", 
    className: "bg-primary text-primary-foreground border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
  rejected: { 
    label: "REJECTED", 
    className: "bg-destructive/10 text-destructive border-0 px-3 py-1.5 uppercase tracking-wide" 
  },
};

export default function ViewRestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getRestaurant(parseInt(id!));
      if (response.status && response.data?.restaurant) {
        setRestaurant(response.data.restaurant);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load restaurant");
    } finally {
      setLoading(false);
    }
  };

  const getDayLabel = (day: string) => {
    const dayObj = daysOfWeek.find(d => d.value === day);
    return dayObj ? dayObj.label : day;
  };

  const parseWorkingHours = (workingHours: any): WorkingHour[] => {
    if (!workingHours) return [];
    if (typeof workingHours === 'string') {
      try {
        workingHours = JSON.parse(workingHours);
      } catch {
        return [];
      }
    }
    if (typeof workingHours === 'object' && !Array.isArray(workingHours)) {
      return Object.entries(workingHours).map(([day, hours]: [string, any]) => ({
        day,
        open: hours.open || "",
        close: hours.close || "",
      }));
    }
    return Array.isArray(workingHours) ? workingHours : [];
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${restaurant.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      await adminApi.deleteRestaurant(parseInt(id!));
      toast.success("Restaurant deleted successfully");
      navigate("/admin/restaurants");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete restaurant");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout portalType="admin">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading restaurant...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!restaurant) {
    return (
      <DashboardLayout portalType="admin">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Restaurant not found</p>
          <Button onClick={() => navigate("/admin/restaurants")} className="mt-4">
            Back to Restaurants
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const status = statusConfig[restaurant.status as keyof typeof statusConfig] || statusConfig.pending;
  const workingHours = parseWorkingHours(restaurant.working_hours);
  const categories = restaurant.categories || [];

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
              <BreadcrumbPage>View</BreadcrumbPage>
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
              {restaurant.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link to={`/admin/restaurants/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                <p className="text-base font-semibold text-foreground">{restaurant.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                <p className="text-base font-semibold text-foreground">{restaurant.address || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Latitude</p>
                  <p className="text-base font-semibold text-foreground">{restaurant.lat || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Longitude</p>
                  <p className="text-base font-semibold text-foreground">{restaurant.lng || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Public Phone</p>
                <p className="text-base font-semibold text-foreground">{restaurant.public_phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Private Phone</p>
                <p className="text-base font-semibold text-foreground">{restaurant.private_phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                <Badge className={cn("font-medium text-xs uppercase tracking-wide", status.className)}>
                  {status.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Featured</p>
                {restaurant.is_featured ? (
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Owner Name</p>
                <p className="text-base font-semibold text-foreground">{restaurant.owner_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Owner Email</p>
                <p className="text-base font-semibold text-foreground">{restaurant.owner_email || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Working Hours</p>
                {workingHours.length > 0 ? (
                  <div className="space-y-2">
                    {workingHours.map((hour, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                        <span className="font-medium text-foreground capitalize">{getDayLabel(hour.day)}</span>
                        <span className="text-sm text-muted-foreground">
                          {hour.open} - {hour.close}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No working hours set</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Food Categories</p>
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category: any) => (
                      <Badge key={category.id} variant="outline" className="px-3 py-1">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No categories</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Profile Picture</p>
                {restaurant.profile_pic ? (
                  <img src={restaurant.profile_pic} alt="Profile" className="h-32 w-32 rounded-lg object-cover" />
                ) : (
                  <p className="text-sm text-muted-foreground">No profile picture</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Cover Image</p>
                {restaurant.cover_image ? (
                  <img src={restaurant.cover_image} alt="Cover" className="h-48 w-full rounded-lg object-cover" />
                ) : (
                  <p className="text-sm text-muted-foreground">No cover image</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Place Pictures</p>
                {restaurant.place_pics && Array.isArray(restaurant.place_pics) && restaurant.place_pics.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {restaurant.place_pics.map((pic: string, index: number) => (
                      <img key={index} src={pic} alt={`Place ${index + 1}`} className="h-32 w-full rounded-lg object-cover" />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No place pictures</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
