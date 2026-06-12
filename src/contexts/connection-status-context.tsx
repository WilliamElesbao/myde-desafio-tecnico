"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type ConnectionStatusContextValue = {
  isOnline: boolean;
};

const ConnectionStatusContext = createContext<
  ConnectionStatusContextValue | undefined
>(undefined);

/** Global context that exposes the network status of the browser (online/offline). */
export function ConnectionStatusProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <ConnectionStatusContext.Provider value={{ isOnline }}>
      {children}
    </ConnectionStatusContext.Provider>
  );
}

export function useConnectionStatus(): ConnectionStatusContextValue {
  const context = useContext(ConnectionStatusContext);
  if (!context) {
    throw new Error(
      "useConnectionStatus deve ser usado dentro de ConnectionStatusProvider",
    );
  }
  return context;
}
