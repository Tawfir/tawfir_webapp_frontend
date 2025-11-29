import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Plus, Search, MoreHorizontal, Eye, Edit, Ban, Mail } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "restaurant_owner" | "customer";
  status: "active" | "inactive" | "banned";
  joinDate: string;
  orders: number;
}

const mockUsers: User[] = [
  { id: "1", name: "Ahmed Ali", email: "ahmed@example.com", role: "customer", status: "active", joinDate: "Jan 15, 2024", orders: 24 },
  { id: "2", name: "Sara Khan", email: "sara@pizzapalace.com", role: "restaurant_owner", status: "active", joinDate: "Dec 10, 2023", orders: 0 },
  { id: "3", name: "Mohammed Hassan", email: "mohammed@example.com", role: "customer", status: "active", joinDate: "Feb 1, 2024", orders: 15 },
  { id: "4", name: "Fatima Noor", email: "fatima@burgerhub.com", role: "restaurant_owner", status: "active", joinDate: "Nov 20, 2023", orders: 0 },
  { id: "5", name: "Admin User", email: "admin@tawfir.com", role: "admin", status: "active", joinDate: "Jan 1, 2023", orders: 0 },
  { id: "6", name: "Omar Sheikh", email: "omar@example.com", role: "customer", status: "banned", joinDate: "Mar 5, 2024", orders: 3 },
];

const roleConfig = {
  admin: { label: "Admin", className: "bg-primary/10 text-primary border-primary/20" },
  restaurant_owner: { label: "Restaurant Owner", className: "bg-info/10 text-info border-info/20" },
  customer: { label: "Customer", className: "bg-muted text-muted-foreground border-border" },
};

const statusConfig = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-border" },
  banned: { label: "Banned", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
            <p className="mt-1 text-muted-foreground">
              Manage platform users and their permissions
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center animate-slide-up">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">All Roles</Button>
            <Button variant="outline" size="sm">All Status</Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => {
                  const role = roleConfig[user.role];
                  const status = statusConfig[user.status];
                  return (
                    <tr key={user.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {user.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge variant="outline" className={cn("font-medium", role.className)}>
                          {role.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge variant="outline" className={cn("font-medium", status.className)}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {user.joinDate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                        {user.orders}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="h-4 w-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
