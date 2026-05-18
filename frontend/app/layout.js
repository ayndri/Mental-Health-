import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Seribu Cerita — Ruang Ceritamu",
  description:
    "Seribu Cerita adalah ruang aman untuk berbagi cerita, mencatat perasaan, dan menemukan kedamaian dalam keseharian.",
  keywords: ["mental health", "journaling", "wellness", "cerita", "mood"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="font-poppins antialiased bg-[#F6F8FB] text-[#1A2840] min-h-screen">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FFFFFF",
              color: "#1A2840",
              fontFamily: "Poppins, sans-serif",
              fontWeight: "600",
              borderRadius: "16px",
              boxShadow: "0 4px 24px 0 rgba(65, 95, 131, 0.15)",
              border: "1px solid #D5E0EE",
            },
            success: {
              iconTheme: {
                primary: "#415f83",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#E596B2",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
