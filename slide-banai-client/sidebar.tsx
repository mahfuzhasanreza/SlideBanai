import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Logo from "./logo";
import {
  Grid,
  FileText,
  Users,
  Mic,
  CreditCard,
  Settings,
  Zap,
  LogOut,
  CodeXml,
  FileSearch
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Grid,
    },
    {
      name: "My Presentations",
      href: "/presentations",
      icon: FileText,
    },
    {
      name: "Shared with me",
      href: "/shared",
      icon: Users,
    },
    {
      name: "Presentation Coach",
      href: "/coach",
      icon: Mic,
    },
    {
      name: "Subscription",
      href: "/subscription",
      icon: CreditCard,
    },
    {
      name: "OCR Test",
      href: "/ocr-test",
      icon: FileSearch,
    },
    {
      name: "API Test",
      href: "/api-test",
      icon: CodeXml,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const userInitials = user?.name
    ? `${user.name.split(" ")[0][0]}${
        user.name.split(" ")[1]?.[0] || user.name.split(" ")[0][1]
      }`
    : user?.username?.substring(0, 2).toUpperCase() || "U";

  return (
    <div className="flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <Logo />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    location === item.href
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      location === item.href
                        ? "text-primary-500"
                        : "text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="p-4 mt-auto">
              <div className="flex items-center mb-4">
                <Avatar className="h-8 w-8 bg-primary-600 text-white">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || user?.username}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              {user?.subscription_type !== "pro" && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Zap className="h-5 w-5 text-primary-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Upgrade to Pro
                      </p>
                      <p className="text-xs text-gray-500">
                        Get unlimited presentations
                      </p>
                    </div>
                  </div>
                  <Button
                    className="mt-3 w-full"
                    size="sm"
                    asChild
                  >
                    <Link href="/subscription">Upgrade Now</Link>
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full justify-start text-gray-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
