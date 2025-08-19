"use client";

import { LayoutDashboard, FileText, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUsageDisplay } from "@/hooks/useUserUsage";
import { text } from "@/lib/typography";
import { useState, useEffect } from "react";
// Using regular img tag instead of Next/Image for better compatibility

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  {
    id: "home",
    label: "Home",
    icon: LayoutDashboard,
    iconColor: "text-blue-500",
  },
  {
    id: "history",
    label: "My Files",
    icon: FileText,
    iconColor: "text-brand-primary",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    iconColor: "text-green-500",
  },
];

export function DashboardSidebar({
  activeTab,
  onTabChange,
}: DashboardSidebarProps) {
  const { user } = useAuth();
  const { userProfile } = useUserProfile();
  const { usage, formatUsageText, isUnlimited } = useUsageDisplay();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[8px] shadow-lg"
      >
        <Menu className="w-5 h-5 text-[#273F4F]" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "h-full bg-[#EFEEEA]/95 backdrop-blur-xl border-r border-[#273F4F]/20 flex flex-col transition-transform duration-300 ease-in-out",
          "lg:w-64 lg:relative lg:translate-x-0",
          "fixed top-0 left-0 w-80 z-50",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-black/[0.05] rounded-[8px] transition-colors duration-150"
          >
            <X className="w-5 h-5 text-[#273F4F]" />
          </button>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-[#273F4F]/10 lg:pt-6 pt-2">
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/logo_send.svg"
                alt="KindleCast Logo"
                className="w-8 h-8"
                onError={(e) => {
                  e.currentTarget.src = "/logo.png";
                }}
              />
            </div>
            <span className="text-xl font-bold text-[#273F4F]">KindleCast</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 pt-6">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      `w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-all duration-200 ${text.body}`,
                      isActive
                        ? "bg-brand-primary text-white"
                        : "text-[#273F4F] hover:text-[#273F4F] hover:bg-white/40"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : item.iconColor
                      )}
                    />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-[#273F4F]/20">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={
                user?.avatar ||
                "https://cdn.jsdelivr.net/gh/alohe/memojis/png/vibrent_3.png"
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://cdn.jsdelivr.net/gh/alohe/memojis/png/vibrent_3.png";
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className={`${text.body} font-semibold truncate`}>
                  {user?.name || "User"}
                </div>
                <div
                  className={`text-white text-xs font-semibold px-2 py-0.5 rounded-full ${
                    userProfile?.user_subscribed
                      ? "bg-brand-primary"
                      : "bg-gray-400"
                  }`}
                >
                  {userProfile?.user_subscribed ? "PRO" : "FREE"}
                </div>
              </div>
              <div className={`${text.caption} truncate`}>
                {user?.email || "user@example.com"}
              </div>
            </div>
          </div>

          {/* Usage Stats - Now with singleton API calls */}
          {userProfile && usage && (
            <div className="mt-4 p-3 bg-white/60 backdrop-blur-xl border border-black/[0.08] rounded-[12px]">
              <h4 className={`${text.caption} font-semibold mb-3`}>
                Usage This Month
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={text.footnote}>Quick Send</span>
                    <span className={`${text.footnote} font-medium`}>
                      {formatUsageText("basic")}
                    </span>
                  </div>
                  {!isUnlimited("basic") && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-brand-primary h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (usage.used_basic_monthly /
                              usage.basic_monthly_limit) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={text.footnote}>AI Formatting</span>
                    <span className={`${text.footnote} font-medium`}>
                      {formatUsageText("ai")}
                    </span>
                  </div>
                  {!isUnlimited("ai") && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (usage.used_ai_monthly / usage.ai_monthly_limit) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
