import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-bg min-h-screen lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-[1200px] px-5 py-7 sm:px-7">{children}</main>
      </div>
    </div>
  );
}
