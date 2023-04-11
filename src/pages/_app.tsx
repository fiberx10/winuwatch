import { type AppType } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { NextIntlProvider } from "next-intl";
import { GetStaticPropsContext } from "next";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NextIntlProvider messages={pageProps.messages }>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NextIntlProvider>
  );
};





export default api.withTRPC(MyApp);
