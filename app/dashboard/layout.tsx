import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Header from "@/components/dashboard/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "../providers/provider";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Generate professional ATS-friendly resume",
};

const queryClient = new QueryClient();

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <Providers>
          {/* <QueryClientProvider client={queryClient}> */}
            {children}
          {/* </QueryClientProvider> */}
        </Providers>
      </body>
    </html>
  );
}
