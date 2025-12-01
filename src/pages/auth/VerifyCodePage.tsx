import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Home, ArrowLeft, KeyRound } from "lucide-react";
import { authApi } from "@/services/api";
import { toast } from "sonner";

export default function VerifyCodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state?.email || "");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // If no email in state, redirect to forgot password
    if (!email) {
      toast.error("Please enter your email first");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const codeString = code.join("");
    
    if (codeString.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await authApi.checkResetCode(email, codeString);
      
      if (response.status) {
        toast.success("Code verified successfully!");
        navigate("/reset-password", { state: { email, code: codeString } });
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code. Please try again.");
      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.requestPasswordResetCode(email);
      if (response.status) {
        toast.success("New code sent! Please check your email.");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code. Please try again.");
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
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Enter Verification Code</h1>
            <p className="mt-2 text-muted-foreground">
              We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          {/* Code Input */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold focus:ring-2 focus:ring-primary"
                  />
                ))}
              </div>
            </div>

            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={handleVerify}
              disabled={isVerifying || code.join("").length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="link"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-primary"
              >
                {isLoading ? "Sending..." : "Resend Code"}
              </Button>
            </div>
          </div>

          <div className="text-center space-y-2">
            <Link
              to="/forgot-password"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to email
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
            Check Your Email
          </h2>
          <p className="text-lg text-white/70">
            Enter the 6-digit verification code we sent to your email address. The code expires in 60 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

