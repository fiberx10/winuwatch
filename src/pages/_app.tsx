import { type AppType } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import StripeProvider from "@/pages/StripeProvider";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const queryClient = new QueryClient();
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </StripeProvider>
    </QueryClientProvider>
  );
};

export default api.withTRPC(MyApp);
