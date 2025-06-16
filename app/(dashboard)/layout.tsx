import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans">
      {/* Subtle dark gradient overlay for depth */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(55, 65, 81, 0.15) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Navbar (Top) */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-black/95 backdrop-blur-xl border-b border-gray-800/50 md:pl-60">
        <Navbar />
      </header>

      {/* Sidebar (Left) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 z-40 bg-black/95 border-r border-gray-800/50">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="pt-16 md:pl-60 px-4 pb-10 min-h-[calc(100vh-4rem)] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;