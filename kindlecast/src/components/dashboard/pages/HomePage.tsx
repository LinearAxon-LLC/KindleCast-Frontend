"use client";

import React, { use, useState } from "react";
import { Plus, FileText, Upload } from "lucide-react";
import { useLinkProcessor } from "@/hooks/useLinkProcessor";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getTimeBasedGreeting } from "@/lib/time-utils";
import { DeviceSetup } from "@/components/dashboard/DeviceSetup";
import { InfoUpdateBox } from "@/components/dashboard/InfoUpdateBox";
import { text } from "@/lib/typography";
import { isValidUrl } from "@/lib/api";
import KindleReader from "@/components/kindleReader/kindleReader";

interface HomePageProps {
  onSwitchTab: (tab: string) => void;
}

export function HomePage({ onSwitchTab }: HomePageProps) {
  const [url, setUrl] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("Quick Send");
  const [previewGenerated, setPreviewGenerated] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showInfoUpdate, setShowInfoUpdate] = useState(true);
  const [urlError, setUrlError] = useState<string | null>(null);
  const { isLoading, isSuccess, error, preview_path, submitLink } =
    useLinkProcessor();
  const { userProfile, isLoading: profileLoading, refetch } = useUserProfile();
  const [activeTab, setActiveTab] = useState<"convert" | "upload">("convert");
  const [includeImage, setIncludeImage] = useState(false);

  const { greeting, emoji } = getTimeBasedGreeting();

  // URL validation function
  const validateUrl = (inputUrl: string): string | null => {
    if (!inputUrl.trim()) {
      return "Please enter a URL";
    }

    // Add protocol if missing
    let urlToValidate = inputUrl.trim();
    if (
      !urlToValidate.startsWith("http://") &&
      !urlToValidate.startsWith("https://")
    ) {
      urlToValidate = "https://" + urlToValidate;
    }

    if (!isValidUrl(urlToValidate)) {
      return "Please enter a valid URL";
    }

    return null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    // Clear error when user starts typing
    if (urlError) {
      setUrlError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate URL
    const validationError = validateUrl(url);
    if (validationError) {
      setUrlError(validationError);
      return;
    }

    // Add protocol if missing
    let processUrl = url.trim();
    if (
      !processUrl.startsWith("http://") &&
      !processUrl.startsWith("https://")
    ) {
      processUrl = "https://" + processUrl;
    }

    // Get the name of the button that was clicked
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;

    // Now you can safely access the 'name' property
    const buttonName = submitter?.name;

    if (buttonName === "preview") {
      console.log("Preview button was clicked");
      await submitLink(processUrl, selectedFormat, customPrompt);
      setPreviewGenerated(true);
    } else if (buttonName === "sendToKindle") {
      console.log("Send to Kindle button was clicked");

      let filePath = preview_path;

      if (!filePath) {
        console.log("No preview found, generating first...");
        filePath = await submitLink(processUrl, selectedFormat, customPrompt);
        // make sure submitLink returns the path of the generated preview
      }

      if (filePath) {
        console.log("Sending mail with:", filePath);

        try {
          const res = await fetch("/api/send-mail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath }),
          });

          if (!res.ok) throw new Error("Failed to send mail");
          const data = await res.json();
          console.log("Mail sent:", data);
        } catch (err) {
          console.error("Error sending mail:", err);
        }
      }
    }
  };

  const handleDeviceSetupComplete = () => {
    refetch(); // Refresh user profile
  };

  const handleInfoUpdateComplete = () => {
    console.log(
      "🔍 HomePage: handleInfoUpdateComplete called, setting showInfoUpdate to false"
    );
    setShowInfoUpdate(false);
    refetch(); // Refresh user profile
  };

  const handleInfoUpdateDismiss = () => {
    setShowInfoUpdate(false);
  };

  // Check if user has completed Kindle setup
  // Based on your API response: kindle_email exists AND acknowledged_mail_whitelisting is 'yes'
  const hasKindleSetup = Boolean(
    userProfile?.kindle_email &&
      userProfile?.acknowledged_mail_whitelisting?.toLowerCase() === "yes"
  );

  // Only show onboarding if user doesn't have a complete setup
  const shouldShowInfoUpdate = userProfile && showInfoUpdate && !hasKindleSetup;

  // Debug what we're getting from API
  // React.useEffect(() => {
  //   if (userProfile) {
  //     console.log('🔍 HomePage Debug:', {
  //       kindle_email: userProfile.kindle_email,
  //       acknowledged_mail_whitelisting: userProfile.acknowledged_mail_whitelisting,
  //       hasKindleSetup,
  //       shouldShowInfoUpdate,
  //       showInfoUpdate
  //     })
  //   }
  // }, [userProfile, hasKindleSetup, shouldShowInfoUpdate])

  if (profileLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-[15px] text-[#273F4F]/70">Loading...</div>
      </div>
    );
  }

  // If no user profile (API failed), show error
  if (!userProfile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-[15px] text-red-600 mb-2">
            Failed to load profile
          </div>
          <div className="text-[13px] text-[#273F4F]/70">
            Please check your connection and try again
          </div>
        </div>
      </div>
    );
  }

  // Show device setup if user hasn't set up their device
  if (!hasKindleSetup) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-8">
          <DeviceSetup onComplete={handleDeviceSetupComplete} />
        </div>
      </div>
    );
  }

  const handleLinkClick = () => {
    // This function will be called by onClick
    // You can add more logic here if needed
    setUrl(
      "https://medium.com/@maddiewang/how-to-build-startups-that-get-in-yc-dabb4c1bfe1b"
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1
            className={`${text.sectionTitle} mb-2 flex items-center space-x-2 text-xl sm:text-2xl lg:text-3xl`}
          >
            <span>
              {greeting}, {userProfile?.name?.split(" ")[0] || "there"}
            </span>
            <span className="text-lg sm:text-xl">{emoji}</span>
          </h1>
        </div>

        {/* Info Update Box */}
        {shouldShowInfoUpdate && (
          <InfoUpdateBox
            onComplete={handleInfoUpdateComplete}
            onDismiss={handleInfoUpdateDismiss}
          />
        )}

        <div
          data-testid="conversion-screen"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full"
        >
          <div>
            <div className="flex bg-white rounded-md mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("convert")}
                className={`flex-1 py-3 text-sm font-medium rounded-sm transition-colors duration-150 ${
                  activeTab === "convert"
                    ? "border-brand-primary m-1 bg-brand-primary text-white"
                    : "border-transparent m-1 text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="None"
                  stroke="currentColor"
                  className={`inline-block h-4 w-4 mr-2 ${
                    activeTab === "convert"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Convert Links
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex-1 py-2 text-sm font-medium rounded-sm transition-colors duration-150 ${
                  activeTab === "upload"
                    ? "border-brand-primary m-1 bg-brand-primary text-white"
                    : "border-transparent m-1 text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={`inline-block h-4 w-4 mr-2 ${
                    activeTab === "upload"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                  <path d="M12 10v6" />
                  <path d="m9 13 3-3 3 3" />
                </svg>
                Upload Files
              </button>
            </div>
            {/* Left Column - Convert & Send */}
            <div className="space-y-4 lg:space-y-6">
              {/* Quick Convert & Send */}
              {activeTab === "convert" && (
                <>
                  <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-4 sm:p-6">
                    {/* Tab Panels */}

                    <h2 className={`${text.componentTitle} mb-4 lg:mb-6`}>
                      Link Converter
                    </h2>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 lg:space-y-6"
                    >
                      {/* URL Input */}
                      <div>
                        <label className={`block ${text.label} mb-3`}>
                          Enter an URL
                        </label>
                        <input
                          type="text"
                          value={url}
                          onChange={handleUrlChange}
                          placeholder="Paste your link - webpage, YouTube, Wikipedia, Reddit, etc."
                          className={`w-full px-4 py-3 border rounded-[8px] ${
                            text.body
                          } focus:outline-none focus:ring-2 transition-all duration-200 ${
                            urlError
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:ring-brand-primary/20 focus:border-brand-primary"
                          }`}
                        />
                        {urlError && (
                          <p className={`${text.caption} mt-2 text-red-600`}>
                            {urlError}
                          </p>
                        )}
                        {!urlError && (
                          <p className={`${text.caption} mt-2`}>
                            Try an example:{" "}
                            <a
                              href="#"
                              onClick={handleLinkClick}
                              // The CSS class from your original code
                            >
                              <span className={text.link}>
                                How to build Startups that get in YC
                              </span>
                            </a>
                          </p>
                        )}
                      </div>

                      {/* Format Selection */}
                      <div>
                        <label className={`block ${text.label} mb-3`}>
                          Choose your format:
                        </label>
                        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                          {[
                            "Quick Send",
                            "Summarize",
                            "Study Guide",
                            "Custom",
                          ].map((format) => (
                            <button
                              key={format}
                              type="button"
                              onClick={() => setSelectedFormat(format)}
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[6px] text-[12px] sm:text-[13px] font-medium transition-all duration-150 active:scale-[0.95] cursor-pointer ${
                                selectedFormat === format
                                  ? "bg-brand-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                                  : "bg-black/[0.04] hover:bg-black/[0.08] text-black/70 border border-black/[0.06]"
                              }`}
                            >
                              {format}
                              {(format === "Summarize" ||
                                format === "Study Guide" ||
                                format === "Custom") && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 50 50"
                                  className={`inline-block h-4 w-4 ml-1.5 ${
                                    selectedFormat === format
                                      ? "text-white"
                                      : "text-black/70"
                                  }`}
                                  fill="currentColor"
                                >
                                  <path d="M22.462 11.035l2.88 7.097c1.204 2.968 3.558 5.322 6.526 6.526l7.097 2.88c1.312.533 1.312 2.391 0 2.923l-7.097 2.88c-2.968 1.204-5.322 3.558-6.526 6.526l-2.88 7.097c-.533 1.312-2.391 1.312-2.923 0l-2.88-7.097c-1.204-2.968-3.558-5.322-6.526-6.526l-7.097-2.88c-1.312-.533-1.312-2.391 0-2.923l7.097-2.88c2.968-1.204 5.322-3.558 6.526-6.526l2.88-7.097C20.071 9.723 21.929 9.723 22.462 11.035zM39.945 2.701l.842 2.428c.664 1.915 2.169 3.42 4.084 4.084l2.428.842c.896.311.896 1.578 0 1.889l-2.428.842c-1.915.664-3.42 2.169-4.084 4.084l-.842 2.428c-.311.896-1.578.896-1.889 0l-.842-2.428c-.664-1.915-2.169-3.42-4.084-4.084l-2.428-.842c-.896-.311-.896-1.578 0-1.889l2.428-.842c1.915-.664 3.42-2.169 4.084-4.084l.842-2.428C38.366 1.805 39.634 1.805 39.945 2.701z" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Description - Only show when Custom is selected */}
                      {selectedFormat === "Custom" && (
                        <div>
                          <label className={`block ${text.label} mb-3`}>
                            Describe how you want it:
                          </label>
                          <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="e.g., 'Make it a study guide with key points highlighted'"
                            className={`w-full px-4 py-3 border border-gray-200 rounded-[8px] ${text.body} focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none`}
                            rows={3}
                          />
                        </div>
                      )}

                      <div className="flex flex-col items-start max-w-sm ">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-900">
                            Include Images?
                          </span>
                          <label
                            htmlFor="image-toggle"
                            className="relative inline-flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              id="image-toggle"
                              checked={includeImage}
                              onChange={() => setIncludeImage(!includeImage)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          name="preview"
                          disabled={
                            isLoading ||
                            !url.trim() ||
                            (selectedFormat === "Custom" &&
                              !customPrompt.trim())
                          }
                          className="w-full px-6 py-3 bg-brand-primary text-white text-base font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <span>Preview</span>
                        </button>{" "}
                        <button
                          type="submit"
                          name="sendToKindle"
                          disabled={
                            isLoading ||
                            !url.trim() ||
                            (selectedFormat === "Custom" &&
                              !customPrompt.trim())
                          }
                          className="w-full px-6 py-3 bg-brand-primary text-white text-base font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <span>Send to Kindle</span>
                        </button>
                      </div>
                      {isLoading ? (
                        <>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-[8px]">
                            <span className="text-sm text-blue-500">
                              Converting...
                            </span>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}

                      {/* Status Messages */}
                      {isSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-[8px]">
                          <p className="text-sm text-green-500">
                            ✓ Successfully sent to your Kindle!
                          </p>
                        </div>
                      )}

                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-[8px]">
                          <p className={text.error}>{error}</p>
                        </div>
                      )}
                    </form>
                  </div>
                </>
              )}

              {/* OR Divider */}
              {/* <div className="flex items-center justify-center">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className={`px-4 ${text.caption} bg-[#EFEEEA]`}>OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div> */}

              {/* Quick Send File Upload */}
              {activeTab === "upload" && (
                <>
                  <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[16px] p-4 sm:p-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-[12px] p-6 sm:p-8 text-center hover:border-brand-primary/50 transition-colors duration-150 cursor-pointer">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className={`${text.body} mb-2`}>
                        Click to upload or drag and drop
                      </p>
                      <p className={text.caption}>
                        MD, DOCX, EPUB, PDF* (max 20MB)
                      </p>
                      <p className={`${text.footnote} mt-2`}>
                        * Only available for legacy paying customers
                      </p>
                      <p className={text.footnote}>
                        * For best quality, use a non-scanned, text-based PDF
                        document
                      </p>
                    </div>

                    <button className="w-full mt-4 px-6 py-3 bg-brand-primary text-white text-base font-medium rounded-[8px] hover:bg-brand-primary/90 transition-colors duration-150">
                      Send to Kindle
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Kindle Preview */}
          <div className="hidden lg:flex items-start justify-center">
            <KindleReader
              url={url}
              urlError={urlError}
              isLoading={isLoading}
              isSuccess={isSuccess}
              error={error}
              preview_path={preview_path}
            ></KindleReader>
          </div>
        </div>
      </div>
    </div>
  );
}
