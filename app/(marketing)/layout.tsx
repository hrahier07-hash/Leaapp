import { MobileShell } from "@/components/layout/MobileShell";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MobileShell title="Sudoku Quest" showNav={false}>
      {children}
    </MobileShell>
  );
}
