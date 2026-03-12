import AppNavbar from "@/components/layout/AppNavbar";
import AppFooter from "@/components/layout/AppFooter";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-canvas flex min-h-screen flex-col">
      <AppNavbar />
      <div className="flex-1">{children}</div>
      <AppFooter />
    </div>
  );
}
