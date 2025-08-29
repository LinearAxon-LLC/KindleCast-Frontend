"use client";

import {
  LayoutDashboard,
  FileText,
  Settings,
  Menu,
  X,
  Crown,
  ChevronDown,
  Home,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUsageDisplay } from "@/hooks/useUserUsage";
import { text } from "@/lib/typography";
import { useState, useEffect, useRef } from "react";
import { UpgradePlansModal } from "@/components/ui/upgrade-plans-modal";
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
  const { user, logout } = useAuth();
  const { userProfile } = useUserProfile();
  const { usage, formatUsageText, isUnlimited } = useUsageDisplay();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="p-3 border-b border-[#273F4F]/10 lg:pt-4">
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            {/* <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="KindleCast Logo"
                className="w-8 h-8"
                onError={(e) => {
                  e.currentTarget.src = "/logo.png";
                }}
              />
            </div> */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-primary rounded-[8px] flex items-center justify-center">
              {/* <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1222_36625)">
                    <path
                      d="M2.70524 0.606445C1.72029 0.876364 0.937712 1.63573 0.635254 2.60678"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.295 0.606445C12.28 0.876364 13.0625 1.63573 13.365 2.60678"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 0.5H8M8 13.5H6"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0.500001 8L0.5 6"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.5002 8V6"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.70524 13.3936C1.72029 13.1237 0.937712 12.3644 0.635254 11.3933"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.295 13.3936C12.28 13.1237 13.0625 12.3644 13.365 11.3933"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 10V4"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 6L7 4L9 6"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1222_36625">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg> */}
              {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-message-square-quote-icon lucide-message-square-quote"
                >
                  <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
                  <path d="M14 13a2 2 0 0 0 2-2V9h-2" />
                  <path d="M8 13a2 2 0 0 0 2-2V9H8" />
                </svg> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="scale-x-[-1] scale-y-[-1] lucide lucide-message-square-quote-icon lucide-message-square-quote"
              >
                <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
                <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
              </svg>
            </div>
            <span className="text-3xl sm:text-2xl font-bold text-[#273F4F]">
              Kinddy
            </span>
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-full flex items-center gap-3 mb-3 p-2 rounded-[8px] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150"
            >
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
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <div className={`${text.body} font-semibold truncate`}>
                    {user?.name || "User"}
                  </div>
                  <div
                    className={`text-white text-xs font-semibold px-2 py-0.5 rounded-full ${
                      userProfile?.subscription_type &&
                      userProfile.subscription_type !== "free"
                        ? userProfile.subscription_name?.toUpperCase() == "PRO"
                          ? "bg-brand-primary"
                          : "bg-brand-secondary"
                        : "bg-gray-400"
                    }`}
                  >
                    {userProfile?.subscription_type &&
                    userProfile.subscription_type !== "free"
                      ? userProfile.subscription_name?.toUpperCase()
                      : "FREE"}
                  </div>
                </div>
                <div className={`${text.caption} truncate`}>
                  {user?.email || "user@example.com"}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-black/60 transition-transform duration-200 ${
                  showUserDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={() => {
                      onTabChange("home");
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150"
                  >
                    <Home className="w-4 h-4 text-black/60" />
                    <span className="text-[15px] font-medium text-black/80">
                      Home
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      onTabChange("files");
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150"
                  >
                    <FileText className="w-4 h-4 text-black/60" />
                    <span className="text-[15px] font-medium text-black/80">
                      My Files
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      onTabChange("settings");
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150"
                  >
                    <Settings className="w-4 h-4 text-black/60" />
                    <span className="text-[15px] font-medium text-black/80">
                      Settings
                    </span>
                  </button>
                  <div className="border-t border-black/[0.08] my-2"></div>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 active:bg-red-100 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span className="text-[15px] font-medium text-red-600">
                      Log out
                    </span>
                  </button>
                </div>
              </div>
            )}
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

              {/* Upgrade Button - Only show for free users */}
              {(userProfile?.subscription_type === "free" ||
                userProfile?.subscription_name?.toLowerCase() === "plus") && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-[8px] hover:bg-brand-primary/90 active:bg-brand-primary/80 transition-all duration-150 active:scale-[0.98]"
                >
                  <Crown className="w-4 h-4" />
                  <span className="text-[13px] font-medium">
                    Upgrade{" "}
                    {userProfile?.subscription_name?.toLowerCase() === "plus"
                      ? "to Pro"
                      : "Now"}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Upgrade Plans Modal - Outside sidebar for proper positioning */}
      <UpgradePlansModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
}
