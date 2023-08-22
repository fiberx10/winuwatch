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
import { env } from "@/env.mjs";
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
      window.gtag("config", env.NEXT_PUBLIC_GA_TRACKING_ID, {
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

                gtag('config', '${env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </Head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_TRACKING_ID}`}
        />




        <Script
          src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"
          strategy="afterInteractive"
        ></Script>
        {/* <Script
          src={
            `https://www.paypal.com/sdk/js?client-id=${env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&buyer-country=US&merchant-id=${env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID}&components=applepay`
          }
        ></Script> */}


        <Component {...pageProps} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NextIntlProvider>
  );
}

export default api.withTRPC(MyApp);
