import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { NeonGlowBackground } from "@/components/ui/NeonGlowBackground";

export const metadata: Metadata = {
  title: "Alfatihah",
  description: "Smart Online Grocery with Location-Based Delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,300,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-[Satoshi] relative min-h-screen overflow-x-hidden">
        <GoogleOAuthProvider clientId={googleClientId}>
          <NeonGlowBackground />
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/assets/87787-602074236.mp4"
            className="fixed inset-0 w-full h-full object-cover z-[-2] pointer-events-none"
          />
          
          <div className="fixed inset-0 bg-white/20 backdrop-blur-[2px] z-[-1] pointer-events-none" />

          <main className="relative z-0 min-h-screen">
            {children}
          </main>
          
          <Toaster position="top-center" richColors closeButton />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
