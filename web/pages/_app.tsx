import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CoffeeIcon } from "lucide-react";
import type { AppProps } from "next/app";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center justify-between w-full h-14 px-3">
          <div className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CoffeeIcon className="size-6" />
            </div>
            <p className="font-extrabold uppercase">Ajay&apos;s Coffee</p>
          </div>
          <div></div>
        </div>
      </div>
      <Component {...pageProps} />
      <Toaster />
    </QueryClientProvider>
  );
}
