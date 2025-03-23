import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure the scroll happens after the page layout stabilizes
    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto", // Instant scrolling to avoid issues
      });
    };

    // Use a timeout to ensure it runs after the current event loop
    const timeout = setTimeout(() => {
      handleScrollToTop();

      // For mobile devices, force scroll to top after a slight delay
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        setTimeout(handleScrollToTop, 100); // Additional scroll after 100ms
      }
    }, 0);

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [pathname]);

  return null;
};

export default ScrollToTop;