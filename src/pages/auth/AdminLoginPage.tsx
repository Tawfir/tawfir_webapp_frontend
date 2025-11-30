import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Mail, Lock, Shield, Home } from "lucide-react";
import { authApi } from "@/services/api";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login(email, password);
      
      if (response.status && response.data && response.data.user) {
        // Verify user is admin
        if (response.data.user.type !== 'admin') {
          toast.error("Access denied. Admin credentials required.");
          return;
        }
        
        toast.success("Admin login successful!");
        navigate("/admin");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      const errorMessage = error.message || error.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Back to Home Button - Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="Tawfir Logo" className="h-12 w-auto" />
              <span className="text-2xl font-bold text-foreground">Tawfir</span>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground border-0 px-3 py-1">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                ADMIN ACCESS
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Portal</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/admin/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in to Admin Portal"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Restaurant login?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Go to Restaurant Portal
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-dark items-center justify-center p-8">
        <div className="max-w-lg text-center animate-slide-up">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2">
            <img src="/logo.png" alt="Tawfir Logo" className="h-full w-auto object-contain" />
          </div>
          <div className="mb-4">
            <Badge className="bg-primary text-primary-foreground border-0 px-4 py-1.5 text-sm mb-4">
              <Shield className="h-4 w-4 mr-2" />
              ADMINISTRATIVE ACCESS
            </Badge>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Platform Management Dashboard
          </h2>
          <p className="text-lg text-white/70">
            Manage restaurants, monitor orders, track analytics, and oversee platform operations from a centralized admin interface.
          </p>
        </div>
      </div>
    </div>
  );
}

