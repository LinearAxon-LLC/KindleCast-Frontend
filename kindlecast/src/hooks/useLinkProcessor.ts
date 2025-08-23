// Custom hook for handling link processing functionality

import { useState, useCallback } from "react";
import { processLink, processFile, validateLinkRequest } from "@/lib/api";
import {
  LinkProcessRequest,
  FileProcessRequest,
  FORMAT_MAPPING,
} from "@/types/api";

interface UseLinkProcessorState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  preview_path: string;
}

interface UseFileProcessorState {
  isFileLoading: boolean;
  isFileSuccess: boolean;
  fileUploadError: string | null;
  file_url: string; // Changed from preview_path to reflect a file URL
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

interface UseFileProcessorReturn extends UseFileProcessorState {
  submitFile: (
    file: File,
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

export function useFileProcessor(): UseFileProcessorReturn {
  // Use the useState hook to manage the state of the file processor.
  const [state, setState] = useState<UseFileProcessorState>({
    isFileLoading: false,
    isFileSuccess: false,
    fileUploadError: null,
    file_url: "",
  });

  /**
   * Resets the hook's state to its initial values.
   */
  const resetState = useCallback(() => {
    setState({
      isFileLoading: false,
      isFileSuccess: false,
      fileUploadError: null,
      file_url: "",
    });
  }, []);

  /**
   * Submits a file to the processing API.
   * @param {File} file - The file object to be uploaded.
   * @param {string} format - The desired output format for the file.
   * @param {boolean} includeImage - Whether to include images in the processed file.
   * @param {boolean} emailContent - Whether to email the processed content.
   * @param {string} [customPrompt] - An optional custom prompt for the processing.
   * @returns {Promise<string>} A promise that resolves to the URL of the processed file, or an empty string on error.
   */
  const submitFile = useCallback(
    async (
      file: File,
      format?: string,
      includeImage?: boolean,
      emailContent?: boolean,
      customPrompt?: string
    ) => {
      // Reset the state to handle a new submission.
      resetState();

      // Simple validation to ensure a file is selected.
      if (!file) {
        setState({
          isFileLoading: false,
          isFileSuccess: false,
          fileUploadError: "Please select a file to upload.",
          file_url: "",
        });
        return "";
      }

      // Set the loading state before the API call.
      setState({
        isFileLoading: true,
        isFileSuccess: false,
        fileUploadError: null,
        file_url: "",
      });

      try {
        // Prepare the request object for the API call.
        const request: FileProcessRequest = {
          file: file,
          format: format
            ? FORMAT_MAPPING[format] || format.toLowerCase()
            : undefined,
          include_image: includeImage,
          email_content: emailContent,
          custom_prompt: customPrompt?.trim() || undefined,
        };

        // Make the API call using the processFile function.
        const response = await processFile(request);
        console.log("File upload response", response);
        if (response.status) {
          // Success case: update the state with the file URL.
          setState({
            isFileLoading: false,
            isFileSuccess: true,
            fileUploadError: null,
            file_url: response.preview_link || "",
          });

          // Auto-reset success state after 4 seconds for a brief success message.
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              isSuccess: false,
            }));
          }, 4000);

          return response.preview_link || "";
        } else {
          // API returned an error: update state with the error message.
          setState({
            isFileLoading: false,
            isFileSuccess: false,
            fileUploadError: response.message || "Failed to upload file.",
            file_url: "",
          });
          return "";
        }
      } catch (error) {
        // Handle network or other unexpected errors.
        setState({
          isFileLoading: false,
          isFileSuccess: false,
          fileUploadError:
            "Network error. Please check your connection and try again.",
          file_url: "",
        });
        return "";
      }
    },
    [resetState]
  );

  // Return the state and functions, so the component using the hook can access them.
  return {
    ...state,
    submitFile,
    resetState,
  };
}
