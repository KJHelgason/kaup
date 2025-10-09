import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleProvider } from "@/components/GoogleProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaup - Icelandic Marketplace",
  description: "Buy and sell items in Iceland",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="is" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <LanguageProvider>
                {children}
                <Toaster richColors position="top-right" />
              </LanguageProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}

