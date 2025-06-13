import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans">
      {/* Radial purple sunburst glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Navbar (Top) */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-black/70 backdrop-blur-md  border-purple-800 md:pl-60">
        <Navbar />
      </header>

      {/* Sidebar (Left) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 z-40">
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