import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { ArrowLeft } from "lucide-react";
import { adminApi } from "@/services/api";
import { toast } from "sonner";

export default function NewCategoryPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    cover: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from name if slug is empty
      if (field === "name" && !prev.slug) {
        updated.slug = value.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      return updated;
    });
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

  const handleCoverChange = (file: File | null) => {
    setCoverFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, cover: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, cover: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await adminApi.createCategory({
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        image: formData.image || undefined,
        cover: formData.cover || undefined,
      });

      if (response.status) {
        toast.success("Category created successfully!");
        navigate("/admin/categories");
      } else {
        toast.error(response.message || "Failed to create category");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setLoading(false);
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
                <Link to="/admin/categories">Food Categories</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New</BreadcrumbPage>
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
              New Food Category
            </h1>
            <p className="mt-1 text-muted-foreground">
              Create a new food category for the platform
            </p>
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
                      placeholder="e.g., Burgers, Salads, Drinks"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      className="mt-1"
                      placeholder="Auto-generated from name"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      URL-friendly version of the name (auto-generated if left empty)
                    </p>
                  </div>

                  <FileUpload
                    value={formData.image || imageFile}
                    onChange={handleImageChange}
                    label="Category Image"
                    previewClassName="h-48"
                  />

                  <FileUpload
                    value={formData.cover || coverFile}
                    onChange={handleCoverChange}
                    label="Category Cover Image (Optional)"
                    previewClassName="h-48"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview or Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.name ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Name</p>
                        <p className="font-semibold text-foreground">{formData.name}</p>
                      </div>
                      {formData.slug && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Slug</p>
                          <p className="font-mono text-sm text-foreground">{formData.slug}</p>
                        </div>
                      )}
                      {formData.image && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Image Preview</p>
                          <img
                            src={formData.image}
                            alt="Category preview"
                            className="w-full h-48 object-cover rounded-lg border border-border"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        Fill in the form to see a preview
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Category"}
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

