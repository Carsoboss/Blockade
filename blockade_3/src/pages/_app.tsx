// _app.tsx
import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "../utils/api";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  const router = useRouter();
  const showNavbar = !router.pathname.startsWith("/ai");

  return (
    <ClerkProvider>
      <Toaster position="top-center" reverseOrder={false} />
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
