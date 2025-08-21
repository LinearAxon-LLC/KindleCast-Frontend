// Custom hook for handling link processing functionality

import { useState, useCallback } from "react";
import { processLink, validateLinkRequest } from "@/lib/api";
import { LinkProcessRequest, FORMAT_MAPPING } from "@/types/api";

interface UseLinkProcessorState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  preview_path: string;
}

interface UseLinkProcessorReturn extends UseLinkProcessorState {
  submitLink: (
    url: string,
    format: string,
    includeImage: boolean,
    emailContent: boolean,
    customPrompt?: string
  ) => Promise<string>;
  resetState: () => void;
}

export function useLinkProcessor(): UseLinkProcessorReturn {
  const [state, setState] = useState<UseLinkProcessorState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    preview_path: "",
  });

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      error: null,
      preview_path: "",
    });
  }, []);

  const submitLink = useCallback(
    async (
      url: string,
      format: string,
      includeImage: boolean,
      emailContent: boolean,
      customPrompt?: string
    ) => {
      // Reset previous state
      setState({
        isLoading: false,
        isSuccess: false,
        error: null,
        preview_path: "",
      });

      // Map frontend format to backend format
      const backendFormat = FORMAT_MAPPING[format] || "epub";

      // Validate the request
      const validationError = validateLinkRequest(
        url,
        backendFormat,
        customPrompt
      );
      if (validationError) {
        setState({
          isLoading: false,
          isSuccess: false,
          error: validationError,
          preview_path: "",
        });
        return "";
      }

      // Set loading state
      setState({
        isLoading: true,
        isSuccess: false,
        error: null,
        preview_path: "",
      });

      try {
        // Prepare the request
        console.log(emailContent);
        const request: LinkProcessRequest = {
          url: url.trim(),
          format: backendFormat,
          include_image: includeImage,
          email_content: emailContent,
          custom_prompt: customPrompt?.trim() || undefined,
        };

        // Make the API call
        const response = await processLink(request);

        if (response.status) {
          // Success
          setState({
            isLoading: false,
            isSuccess: true,
            error: null,
            preview_path: response.preview_link,
          });

          // Auto-reset success state after 4 seconds
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              isSuccess: false,
            }));
          }, 4000);

          return response.preview_link;
        } else {
          // API returned error
          setState({
            isLoading: false,
            isSuccess: false,
            error: response.message || "Failed to process link",
            preview_path: "",
          });
          return "";
        }
      } catch {
        // Network or other error
        setState({
          isLoading: false,
          isSuccess: false,
          error: "Network error. Please check your connection and try again.",
          preview_path: "",
        });
        return "";
      }
    },
    []
  );

  return {
    ...state,
    submitLink,
    resetState,
  };
}
