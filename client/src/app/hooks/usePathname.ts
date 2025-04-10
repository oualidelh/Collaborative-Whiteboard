import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const usePathnameListener = (callback: (path: string) => void) => {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevPathnameRef.current && prevPathnameRef.current !== pathname) {
      callback(pathname);
    }

    prevPathnameRef.current = pathname;
  }, [pathname, callback]);
};
