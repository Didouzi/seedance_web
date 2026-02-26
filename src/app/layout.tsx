import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seedance 2.0 - Free AI Video Generator | Text/Image to Video",
  description: "Create cinematic AI videos with Seedance 2.0. Text-to-video, image-to-video, native audio. The Seedance 2.0 AI video generator. Free to start.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
