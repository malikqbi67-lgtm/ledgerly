import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ledgerly — Personal Finance Tracker",
  description:
    "A modern dashboard to track your income, expenses, and remaining balance.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
