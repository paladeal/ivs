"use client";
import { useRouteGuard } from "@/app/_hooks/useRouteGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useRouteGuard();
  return <div className="">{children}</div>;
}
