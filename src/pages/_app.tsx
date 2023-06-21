/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { AppProps } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { type AbstractIntlMessages, NextIntlProvider } from "next-intl";
import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";

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
  
  /*pageview: (url: string) => {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
    // @ts-ignore
    window.gtag("config", gtag.GA_TRACKING_ID, {
      page_path: url,
    });
  },
  event: ({ action, category, label, value }: any) => {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/events
    // @ts-ignore
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  },*/
};

function MyApp({
  Component,
  pageProps,
}: Omit<AppProps<PageProps>, "pageProps"> & {
  pageProps: PageProps;
}) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // @
      //@ts-ignore
      window.gtag("config", gtag.GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gtag.GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </Head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NextIntlProvider>
  );
}

export default api.withTRPC(MyApp);
