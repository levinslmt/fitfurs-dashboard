import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Navbar />

        <main className="p-8 pt-24">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;