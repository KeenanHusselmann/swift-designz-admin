import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swift Designz Admin",
  description: "Business management portal for Swift Designz",
  icons: { icon: "/favicon.png" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Swift Designz Admin",
    description: "Business management portal for Swift Designz",
    url: "https://admin.swiftdesignz.co.za",
    siteName: "Swift Designz Admin",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Swift Designz" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.classList.toggle("dark",localStorage.getItem("theme")!=="light")}catch(e){}` }} />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
