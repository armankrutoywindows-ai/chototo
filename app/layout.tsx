import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Барахолка колледжа",
  description: "Объявления студентов колледжа",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
