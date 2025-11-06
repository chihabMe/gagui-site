import { useCallback } from "react";

declare global {
  interface Window {
    gtag_report_conversion: (url?: string) => boolean;
  }
}

export function useGoogleAds() {
  const reportConversion = useCallback((url?: string) => {
    if (typeof window !== "undefined" && window.gtag_report_conversion) {
      return window.gtag_report_conversion(url);
    }
    return false;
  }, []);

  return { reportConversion };
}
