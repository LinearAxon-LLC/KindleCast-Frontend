"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Menu, X } from "lucide-react";
import { useLinkProcessor } from "@/hooks/useLinkProcessor";
import { AuthDialog } from "@/components/ui/auth-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { UserDropdown } from "@/components/ui/user-dropdown";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { usePaymentFlow } from "@/hooks/usePayment";
import Image from "next/image";
import { HomePageStructuredData } from "@/components/seo/StructuredData";
import KindleReaderHome from "@/components/kindleReader/kindleReaderHome";

// Image Placeholders with taller aspect ratio for screenshots
function FeatureImage({
  image,
  className = "",
}: {
  image: string;
  className?: string;
}) {
  return (
    <div className={`w-full aspect-[5/3] rounded-2xl ${className}`}>
      <img src={image} alt="Feature" className="w-full h-full object-cover" />
    </div>
  );
}

export default function Home() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isLoading, isSuccess, error, submitLink } = useLinkProcessor();
  const {
    isAuthenticated,
    user,
    setRedirectIntent,
    setPendingLinkData,
    getPendingLinkData,
  } = useAuth();
  const { userProfile } = useUserProfile();
  const {
    plans,
    isLoading: plansLoading,
    isUserCurrentPlan,
  } = usePricingPlans();
  const { initiatePayment, isLoading: paymentLoading } = usePaymentFlow();

  // Cache user data on landing page load (called once when authenticated)
  useEffect(() => {
    if (isAuthenticated && user) {
      // User data is already cached in AuthContext, no need to call API again
      // The user object already contains subscription_name from /auth/me
    }
  }, [isAuthenticated, user]);

  const getPricingButtonConfig = (planName?: string, isFree?: boolean) => {
    if (!isAuthenticated) {
      return {
        text: "Get Started",
        action: () => {
          // Set redirect intent for premium plans
          if (!isFree && planName) {
            setRedirectIntent("payment", planName);
          } else {
            setRedirectIntent("dashboard");
          }
          setShowAuthDialog(true);
        },
        disabled: false,
      };
    }

    // If user is pro and this is the free plan
    if (isFree && userProfile?.subscription_type === "premium") {
      return {
        text: "Downgrade to Free",
        action: () => {},
        disabled: false,
      };
    }

    if (userProfile?.user_subscribed) {
      return {
        text: "Go to Dashboard",
        action: () => (window.location.href = "/dashboard"),
        disabled: false,
      };
    }

    // User is logged in but not subscribed (free trial)
    if (isFree) {
      return {
        text: "Get Started Free",
        action: () => (window.location.href = "/dashboard"),
        disabled: false,
      };
    }

    // Premium plan - use payment API
    return {
      text: "Upgrade to Pro",
      action: () => {
        if (planName) {
          initiatePayment(planName, () => setShowAuthDialog(true));
        }
      },
      disabled: false,
    };
  };

  return (
    <div className="min-h-screen bg-[#EFEEEA]">
      {/* Navigation */}
      <nav className="fixed top-4 left-4 right-4 sm:top-6 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 bg-[#EFEEEA]/80 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)]">
        <div className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 flex items-center justify-between w-full sm:w-[900px] sm:max-w-[calc(100vw-48px)]">
          <div className="flex items-center space-x-3 lg:space-x-0">
            <button
              className="lg:hidden p-2 rounded-[8px] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-black/60" />
              ) : (
                <Menu className="w-5 h-5 text-black/60" />
              )}
            </button>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-primary rounded-[8px] flex items-center justify-center">
                <svg
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
                </svg>
              </div>
              <span className="text-[15px] sm:text-[17px] font-bold text-black/90">
                Kinddy
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a
              href="#how-it-works"
              className="text-black/60 hover:text-black/85 font-medium cursor-pointer text-[13px] transition-colors duration-200"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-black/60 hover:text-black/85 font-medium cursor-pointer text-[13px] transition-colors duration-200"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-black/60 hover:text-black/85 font-medium cursor-pointer text-[13px] transition-colors duration-200"
            >
              FAQ
            </a>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <a
                    href="/dashboard"
                    className="bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[13px] font-medium py-2 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  >
                    Go to Dashboard
                  </a>
                  <UserDropdown />
                </>
              ) : (
                <button
                  className="bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[13px] font-medium py-2 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  onClick={() => setShowAuthDialog(true)}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>

          <div className="lg:hidden w-9"></div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="py-4 px-4 sm:px-6 space-y-4">
              <a
                href="#pricing"
                className="block text-black/60 hover:text-black/85 font-medium cursor-pointer text-[15px] transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="block text-black/60 hover:text-black/85 font-medium cursor-pointer text-[15px] transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>

              <div className="pt-4 border-t border-black/[0.08]">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <a
                      href="/dashboard"
                      className="block w-full bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[15px] font-medium py-3 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Go to Dashboard
                    </a>
                    <div className="flex items-center space-x-3 px-2">
                      <Image
                        src={
                          user?.avatar ||
                          "https://cdn.jsdelivr.net/gh/alohe/memojis/png/vibrent_3.png"
                        }
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-brand-primary/20"
                      />
                      <span className="text-[15px] font-medium text-black/85">
                        {user?.name || "User"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 active:bg-brand-primary/80 text-white text-[15px] font-medium py-3 px-4 rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowAuthDialog(true);
                    }}
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - A Color */}
      <section className="pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-32 bg-[#EFEEEA] px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[32px] sm:text-[44px] lg:text-6xl font-bold text-black/85 leading-[34px] sm:leading-[44px] lg:leading-[56px] mb-2 sm:mb-3">
            Save Your Eyes
          </h1>
          <h1 className="text-[32px] sm:text-[44px] lg:text-6xl font-bold leading-[34px] sm:leading-[44px] lg:leading-[56px] mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-red-500 bg-clip-text text-transparent">
              Read Anything on Kindle.
            </span>
          </h1>

          <p className="text-[15px] sm:text-[17px] lg:text-xl text-center text-gray-600 leading-tight max-w-3xl mx-auto px-2 sm:px-4">
            Send
            <span
              className="mx-1 sm:mx-2 inline-block bg-purple-500 rounded-sm"
              style={{ transform: "skew(-10deg)" }}
            >
              <span
                className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
                style={{ transform: "skew(10deg)" }}
              >
                blog posts
              </span>
            </span>
            ,
            <span
              className="mx-1 sm:mx-2 inline-block bg-fuchsia-500 rounded-sm"
              style={{ transform: "skew(-10deg)" }}
            >
              <span
                className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
                style={{ transform: "skew(10deg)" }}
              >
                news articles
              </span>
            </span>
            ,
            <span
              className="mx-1 sm:mx-2 inline-block bg-blue-500 rounded-sm"
              style={{ transform: "skew(-10deg)" }}
            >
              <span
                className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
                style={{ transform: "skew(10deg)" }}
              >
                research papers
              </span>
            </span>
            ,
            <span
              className="mx-1 sm:mx-2 inline-block bg-red-500 rounded-sm"
              style={{ transform: "skew(-10deg)" }}
            >
              <span
                className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
                style={{ transform: "skew(10deg)" }}
              >
                youtube content
              </span>
            </span>
            ,
            <span
              className="mx-1 sm:mx-2 inline-block bg-orange-500 rounded-sm"
              style={{ transform: "skew(-10deg)" }}
            >
              <span
                className="px-1.5 sm:px-2 inline-block text-white font-semibold text-[12px] sm:text-[14px]"
                style={{ transform: "skew(10deg)" }}
              >
                reddit posts
              </span>
            </span>
            to the comfortable screen of your Kindle. Supercharge your reading
            with{" "}
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-red-500  bg-clip-text text-transparent font-bold text-xl">
              {" "}
              Kinddy's AI Powered{" "}
            </span>{" "}
            {"  "} web content to Kindle EPUB transformation.
          </p>

          {/* macOS Native Input Box */}
        </div>
        <KindleReaderHome
          url={""}
          urlError={null}
          isLoading={false}
          isSuccess={false}
          error={null}
          preview_path={""}
          isAuthenticated={isAuthenticated}
          setShowAuthDialog={setShowAuthDialog}
        ></KindleReaderHome>
      </section>

      {/* How it Works Section - B Color */}
      <section
        id="how-it-works"
        className="py-16 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12 bg-[#E8E7E3]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20 lg:mb-24">
            <h2 className="text-[32px] sm:text-[40px] lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              How it Works
            </h2>
            <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Features to save your eyes and make your reading more comfortable.
            </p>
            <div className="p-0 mt-8 sm:mt-12 lg:mt-16 rounded-2xl overflow-hidden shadow-xl">
              <img
                className="w-full h-auto block"
                src="/landing/dashboard-preview.webp"
                alt="How it Works"
              />
            </div>
          </div>

          <div className="space-y-16 sm:space-y-20 lg:space-y-32">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Liberate Content From Any Source
                </h3>
                <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 leading-relaxed">
                  Your reading list is everywhere. Effortlessly capture articles
                  from news sites, posts from social media, chapters from PDFs,
                  and even transcripts from videos. If you can link to it or
                  upload it, you can read it on your Kindle.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Web articles & blog posts
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Social Media post or thread
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      YouTube Video
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      PDF, Docx, ReadMe, EPUB documents
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 lg:mt-0">
                <FeatureImage image="/landing/Feature-0.webp" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6 lg:order-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Enjoy an Uninterrupted Reading Flow -
                  <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-red-500  bg-clip-text text-transparent">
                    Powered by AI
                  </span>{" "}
                </h3>
                <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 leading-relaxed">
                  Our AI acts as your digital de-clutter. It intelligently
                  strips away ads, pop-ups, and website clutter, leaving you
                  with nothing but the clean, beautifully formatted text. It’s
                  the serene reading experience you've been missing.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Summarization & key point extraction
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Study Guide Generation
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Custom instructions
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 lg:mt-0 lg:order-1">
                <FeatureImage image="/landing/Feature-2.webp" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Build Your Personal Knowledge Base
                </h3>
                <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 leading-relaxed">
                  Never lose a valuable article again. Every piece of content
                  you convert is automatically saved to your personal library.
                  Re-read your favorites, discover new connections, and build a
                  powerful, searchable archive of the ideas that matter to you.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-tertiary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Perfect EPUB formatting, Kindle optimized
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-tertiary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Link and file tracking
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-tertiary rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Resend to Kindle or Download
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 lg:mt-0">
                <FeatureImage image="/landing/Feature-3.webp" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6 lg:order-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Seamlessly Integrated With Your Kindle
                </h3>
                <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600 leading-relaxed">
                  Set your Kindle email once and you're done. Our
                  "send-it-and-forget-it" system works quietly in the
                  background, delivering perfectly formatted articles directly
                  to your device. It feels like magic.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Change your Kindle email anytime.
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Track your billing, cancel anytime.
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                    <span className="text-gray-600 text-[15px] sm:text-base">
                      Track your usages and upgrade when you need more.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 lg:mt-0 lg:order-1">
                <FeatureImage image="/landing/Feature-4.webp" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - A Color */}
      <section
        id="pricing"
        className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#EFEEEA]"
      >
        <div className="max-w-fit mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-[32px] sm:text-[40px] lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[16px] sm:text-[18px] lg:text-xl text-gray-600">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-fit mx-auto">
            {plansLoading ? (
              // Loading skeleton
              <>
                <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 animate-pulse">
                  <div className="text-center">
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="h-12 bg-gray-300 rounded mb-6"></div>
                    <div className="space-y-3 mb-8">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 animate-pulse">
                  <div className="text-center">
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="h-12 bg-gray-300 rounded mb-6"></div>
                    <div className="space-y-3 mb-8">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </>
            ) : (
              plans.map((plan) => {
                const isCurrentPlan = isUserCurrentPlan(
                  plan.name,
                  user?.subscription_name
                );
                const isFree = plan.subscription_type === "free";
                const isPlus = plan.display_name.toLowerCase() === "plus";
                const isPro = plan.display_name.toLowerCase() === "pro";

                return (
                  <div
                    key={plan.name}
                    className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative ${
                      isFree
                        ? "bg-gray-50 border border-gray-200"
                        : isPlus
                        ? "bg-brand-secondary"
                        : "bg-brand-primary"
                    }`}
                  >
                    {plan.is_most_popular && (
                      <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-brand-accent text-brand-primary px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h3
                        className={`text-xl sm:text-2xl font-bold mb-2 ${
                          isFree ? "text-gray-900" : "text-white"
                        }`}
                      >
                        {plan.display_name}
                      </h3>
                      <div className="mb-6">
                        {plan.original_price !== plan.discounted_price &&
                        plan.original_price > 0 ? (
                          <div className="flex flex-col items-center">
                            <span
                              className={`text-lg sm:text-xl font-bold line-through mb-1 ${
                                isFree ? "text-gray-500" : "text-white/60"
                              }`}
                            >
                              ${plan.original_price.toFixed(2)}
                            </span>
                            <div className="flex items-baseline">
                              <span
                                className={`text-3xl sm:text-4xl font-bold ${
                                  isFree ? "text-gray-900" : "text-white"
                                }`}
                              >
                                ${plan.discounted_price.toFixed(2)}
                              </span>
                              <span
                                className={`text-sm sm:text-base ml-1 ${
                                  isFree ? "text-gray-600" : "text-white/80"
                                }`}
                              >
                                /{plan.billing_cycle}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-baseline justify-center">
                            <span
                              className={`text-3xl sm:text-4xl font-bold ${
                                isFree ? "text-gray-900" : "text-white"
                              }`}
                            >
                              ${plan.discounted_price.toFixed(2)}
                            </span>
                            <span
                              className={`text-sm sm:text-base ml-1 ${
                                isFree ? "text-gray-600" : "text-white/80"
                              }`}
                            >
                              /{plan.billing_cycle}
                            </span>
                          </div>
                        )}
                      </div>
                      <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-left">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                isFree ? "bg-gray-400" : "bg-white"
                              }`}
                            ></div>
                            <span
                              className={`text-sm sm:text-base ${
                                isFree ? "text-gray-600" : "text-white/90"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full cursor-pointer text-sm sm:text-base ${
                          isCurrentPlan ||
                          getPricingButtonConfig(plan.name, isFree).disabled
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : isFree
                            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            : "bg-white text-brand-primary hover:bg-gray-100"
                        } ${
                          paymentLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={
                          isCurrentPlan ||
                          getPricingButtonConfig(plan.name, isFree).disabled
                            ? undefined
                            : getPricingButtonConfig(plan.name, isFree).action
                        }
                        disabled={
                          isCurrentPlan || paymentLoading // ||
                          // getPricingButtonConfig(plan.name, isFree).disabled
                        }
                      >
                        {paymentLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : isCurrentPlan ? (
                          "Your Current Subscription"
                        ) : (
                          getPricingButtonConfig(plan.name, isFree).text
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section - B Color */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#E8E7E3]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[32px] sm:text-[40px] lg:text-5xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                How does Kinddy work?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Just paste any link or upload a document, and Kinddy instantly
                cleans up the content—removing ads, pop-ups, and clutter—then
                reformats it into a seamless, Kindle-friendly reading
                experience.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                What’s the difference between Quick Send and AI Formatting?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                <b>Quick Send</b> gives you a clean, distraction-free EPUB in
                seconds.
                <b>AI Formatting</b> takes it further—using advanced AI to
                summarize, restructure, or even turn the content into a study
                guide or cheat sheet.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                How does{" "}
                <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-red-500 bg-clip-text text-transparent">
                  AI Content Transformation
                </span>{" "}
                make reading better?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                With one click, you can{" "}
                <b className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-red-500 bg-clip-text text-transparent uppercase">
                  Summarize
                </b>
                , create an{" "}
                <b className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-red-500 bg-clip-text text-transparent uppercase">
                  AI Study Guide
                </b>
                , or provide your own{" "}
                <b className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-red-500 bg-clip-text text-transparent uppercase">
                  Custom Instructions
                </b>
                . This means less fluff, more focus—so you absorb key insights
                faster.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                What kind of content can I convert?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Articles, blog posts, newsletters, social threads, research
                papers, and even YouTube videos (we grab the transcript for
                you). If it’s text-based, Kinddy can likely send it to your
                Kindle—clean and ready to read.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Does it work on all Kindle devices?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Yep! Kinddy is optimized for every Kindle model, including
                Paperwhite, Oasis, Scribe, and even the basic Kindle.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Can I try it for free?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Absolutely. Every user starts with{" "}
                <b>
                  <u>5 free Quick Sends and 3 AI Formattings each month</u>
                </b>
                —no credit card needed. Test it out, see the quality, and
                upgrade only if you love it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - A Color */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#EFEEEA]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h2 className="text-[32px] sm:text-[40px] lg:text-5xl font-bold text-gray-900 leading-tight">
              Stop Straining. Start Reading.
            </h2>
            <p className="text-[18px] sm:text-[20px] lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Reclaim your focus and give your eyes the break they deserve. Send
              your first article in the next 60 seconds. The experience will
              change the way you read online, forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="xl"
                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 text-lg font-medium shadow-lg"
                onClick={() => setShowAuthDialog(true)}
              >
                Start Your Free Trial Now
              </Button>
              {/*<Button*/}
              {/*    variant="outline"*/}
              {/*    size="xl"*/}
              {/*    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium"*/}
              {/*>*/}
              {/*    Watch Demo*/}
              {/*</Button>*/}
            </div>
            <div className="pt-6">
              <p className="text-gray-500 text-sm">
                No credit card required • 5 QUICK SEND & 3 AI FORMATTING free
                conversions • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 sm:mb-20">
            {/* Brand Section */}
            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_footer)">
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
                      <clipPath id="clip0_footer">
                        <rect width="14" height="14" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span className="font-bold text-white text-4xl">Kinddy</span>
              </div>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                Transform any digital content into comfortable, eye-friendly
                Kindle reading experiences. Save your eyes, enhance your
                reading, and enjoy content the way it was meant to be consumed.
              </p>
              {/*<div className="space-y-4">*/}
              {/*    <div className="flex items-center space-x-3">*/}
              {/*        <div className="w-2 h-2 bg-brand-tertiary rounded-full"></div>*/}
              {/*        <span className="text-white/60">99.9% uptime guarantee</span>*/}
              {/*    </div>*/}
              {/*</div>*/}
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
              <div className="space-y-6">
                <h4 className="font-semibold text-white text-lg">Product</h4>
                <ul className="space-y-4 text-white/60">
                  <li>
                    <a
                      href="#pricing"
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      Chrome Extension (Coming Soon)
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-semibold text-white text-lg">Support</h4>
                <ul className="space-y-4 text-white/60">
                  <li>
                    <a
                      href="mailto:support@kinddy.com?subject=Help%20Center%20Inquiry&body=Hi%20Kinddy%2C%0A%0AI%20need%20help%20with..."
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:support@kinddy.com?subject=Contact%20Us%20Inquiry&body=Hi%20Kinddy%2C%0A%0AI%20want%20to%20get%20in%20touch..."
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linearaxon-ai.betteruptime.com"
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      Status Page
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:support@kinddy.com?subject=Bug%20Report&body=Hi%20Kinddy%2C%0A%0AI%20found%20a%20bug..."
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      Bug Reports
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:support@kinddy.com?subject=Feature%20Request&body=Hi%20Kinddy%2C%0A%0AI%20would%20love%20to%20see..."
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      Feature Requests
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-semibold text-white text-lg">Legal</h4>
                <ul className="space-y-4 text-white/60">
                  <li>
                    <a
                      href="/privacy-policy"
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms-of-service"
                      className="hover:text-white transition-colors cursor-pointer text-base"
                    >
                      Terms of Service
                    </a>
                  </li>
                  {/*<li><a href="/refund-policy"*/}
                  {/*       className="hover:text-white transition-colors cursor-pointer text-base">Refund*/}
                  {/*    Policy</a></li>*/}
                </ul>
              </div>
            </div>
          </div>

          {/* Big Kinddy Text */}
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-6xl lg:text-[10rem] font-bold text-white tracking-tight mb-6">
              <span
                className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-xl"
                style={{
                  textShadow:
                    "0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255, 255, 255, 0.15), 0 0 120px rgba(255, 255, 255, 0.05)",
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.09))",
                }}
              >
                Kinddy
              </span>
            </h2>
            <p className="text-white/70 text-xl sm:text-2xl lg:text-3xl font-light tracking-wide">
              Made for readers who value their eyesight
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6">
            <div className="text-center">
              <p className="text-white/40 text-sm">
                © {new Date().getFullYear()} Kinddy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      {/* Auth Dialog */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        linkData={getPendingLinkData() || undefined}
      />

      {/* SEO Structured Data */}
      <HomePageStructuredData />
    </div>
  );
}
