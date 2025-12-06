import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Store,
  ShoppingCart,
  Users,
  ArrowRight,
  Check,
  Star,
  Leaf,
} from "lucide-react";
import { useEffect, useState } from "react";
import { authApi } from "@/services/api";

interface PlatformMetrics {
  total_restaurants: number;
  total_users: number;
  orders_processed: number;
  co2_saved_kg: number;
}

export default function Index() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await authApi.getMetrics();
        if (response.status && response.data) {
          setMetrics(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Tawfir Logo" className="h-9 w-auto" />
            <span className="text-xl font-bold text-foreground">Tawfir</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Restaurant Login</Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="outline">Admin Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {metrics && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary animate-fade-in">
                <Star className="h-4 w-4 fill-current" />
                Trusted by {metrics.total_restaurants}+ restaurants
              </div>
            )}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-slide-up">
              Restaurant Management{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: "100ms" }}>
              Streamline your restaurant operations with our all-in-one platform.
              Manage orders, menus, and customers from a single dashboard.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link to="/login">
                <Button size="xl" className="w-full sm:w-auto">
                  Restaurant Portal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Everything You Need</h2>
            <p className="mt-4 text-muted-foreground">
              Powerful features to help you manage your restaurant business
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Store,
                title: "Restaurant Management",
                description: "Manage multiple locations, staff, and operations from one dashboard.",
              },
              {
                icon: ShoppingCart,
                title: "Order Tracking",
                description: "Real-time order updates and seamless kitchen communication.",
              },
              {
                icon: Users,
                title: "Customer Insights",
                description: "Understand your customers with detailed analytics and reports.",
              },
              {
                icon: ChefHat,
                title: "Menu Builder",
                description: "Create and update menus easily with our intuitive editor.",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center animate-pulse">
                    <div className="h-12 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </>
            ) : metrics ? (
              [
                { 
                  value: metrics.total_restaurants.toLocaleString(), 
                  label: "Restaurants",
                  icon: Store,
                },
                { 
                  value: metrics.orders_processed.toLocaleString(), 
                  label: "Orders Processed",
                  icon: ShoppingCart,
                },
                { 
                  value: metrics.total_users.toLocaleString(), 
                  label: "Total Users",
                  icon: Users,
                },
                { 
                  value: `${metrics.co2_saved_kg.toLocaleString(undefined, { maximumFractionDigits: 0 })}kg`, 
                  label: "CO₂ Saved",
                  icon: Leaf,
                },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                  <p className="mt-2 text-muted-foreground">{stat.label}</p>
                </div>
              ))
            ) : (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      -
                    </p>
                    <p className="mt-2 text-muted-foreground">Loading...</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">
            Join hundreds of restaurants already using Tawfir to streamline their operations.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/login">
              <Button size="xl" variant="gradient">
                Access Restaurant Portal
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Tawfir Logo" className="h-8 w-auto" />
              <span className="font-bold text-foreground">Tawfir</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Tawfir. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
