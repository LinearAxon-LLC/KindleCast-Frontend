// API utilities for KindleCast

import {
  LinkProcessRequest,
  LinkProcessResponse,
  FileProcessRequest,
  FileProcessResponse,
  API_CONFIG,
} from "@/types/api";

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates the link processing request
 */
export function validateLinkRequest(
  url: string,
  format: string,
  customPrompt?: string
): string | null {
  // Check if URL is provided
  if (!url.trim()) {
    return "Please enter a URL";
  }

  // Validate URL format
  if (!isValidUrl(url.trim())) {
    return "Please enter a valid URL";
  }

  // Check if custom prompt is provided when format is custom
  if (format === "custom" && !customPrompt?.trim()) {
    return "Please provide a description for custom formatting";
  }

  return null; // No validation errors
}

/**
 * Processes a link by sending it to the KindleCast API
 */
export async function processLink(
  request: LinkProcessRequest
): Promise<LinkProcessResponse> {
  const { AuthenticatedAPI } = await import("./auth");

  try {
    const response = await AuthenticatedAPI.makeRequest<LinkProcessResponse>(
      API_CONFIG.ENDPOINTS.PROCESS_LINK,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );

    return response;
  } catch (error) {
    console.error("API request failed:", error);

    // Return a user-friendly error response
    return {
      status: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to process link. Please try again.",
      preview_link: "",
    };
  }
}

export async function processFile(
  request: FileProcessRequest
): Promise<FileProcessResponse> {
  const formData = new FormData();
  // Append all required form fields to the FormData object
  const { AuthenticatedAPI } = await import("./auth");
  formData.append("file", request.file, request.file.name);
  // formData.append("format", request.format);
  // formData.append("include_image", String(request.includeImage));
  // formData.append("email_content", String(request.emailContent));
  // if (request.customPrompt) {
  //   formData.append("custom_prompt", request.customPrompt);
  // }

  console.log("Uploading file:", request.file);
  console.log("Is File object?", request.file instanceof File);
  console.log("Name:", request.file?.name);

  try {
    // The makeRequest method is used to send the file.
    // Note that we set the body to the formData object.
    // We do NOT need to set the 'Content-Type' header; the browser will set it
    // automatically to 'multipart/form-data' and include the correct boundary.
    const response = await AuthenticatedAPI.makeRequest<FileProcessResponse>(
      API_CONFIG.ENDPOINTS.PROCESS_FILE,
      {
        method: "POST",
        body: formData,
      },
      true,
      false,
      true
    );

    return response;
  } catch (error) {
    console.error("File upload failed:", error);

    // Return a user-friendly error response in case the API call fails.
    return {
      status: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to upload file. Please try again.",
    };
  }
}
