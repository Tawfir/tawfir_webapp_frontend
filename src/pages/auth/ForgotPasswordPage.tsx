import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Home, ArrowLeft } from "lucide-react";
import { authApi } from "@/services/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.requestPasswordResetCode(email);
      
      if (response.status) {
        toast.success("Reset code sent! Please check your email.");
        // Navigate to verify code page with email in state
        navigate("/verify-code", { state: { email } });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset code. Please try again.");
      console.error("Request reset code error:", error);
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot Password?</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your email address and we'll send you a 6-digit code to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Sending code..." : "Send Reset Code"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-dark items-center justify-center p-8">
        <div className="max-w-lg text-center animate-slide-up">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2">
            <img src="/logo.png" alt="Tawfir Logo" className="h-full w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Reset Your Password
          </h2>
          <p className="text-lg text-white/70">
            Don't worry! Enter your email and we'll send you a verification code to reset your password securely.
          </p>
        </div>
      </div>
    </div>
  );
}

