import { useEffect, useState } from "react";

export default function useIsMobile(maxWidth: number = 600) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= maxWidth : false
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= maxWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [maxWidth]);

  return isMobile;
}
