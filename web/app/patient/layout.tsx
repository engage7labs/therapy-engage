"use client";

export default function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Since we're using AppShell now, this layout just passes through children
  return <>{children}</>;
}
