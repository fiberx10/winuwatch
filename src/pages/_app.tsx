import type { AppProps } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { type AbstractIntlMessages, NextIntlProvider } from "next-intl";
import {useEffect} from "react";
import {analytics} from "@/utils/firebase";

type PageProps = {
  messages: AbstractIntlMessages;
  now: number;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const gtag = {
  GA_TRACKING_ID: "G-LY2QC1SJ1P",
};
function MyApp({
  Component,
  pageProps,
}: Omit<AppProps<PageProps>, "pageProps"> & {
  pageProps: PageProps;
}) {/*
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // @ts-ignore
      window.gtag("config", gtag.GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  */
  useEffect(() => {
    analytics;
  }, []);
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <QueryClientProvider client={queryClient}>

        <Component {...pageProps} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NextIntlProvider>
  );
}

export default api.withTRPC(MyApp);
