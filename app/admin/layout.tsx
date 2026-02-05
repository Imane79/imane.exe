import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Admin Header */}
      <header className="bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Site Title */}
            <div>
              <h1 className="text-xl font-bold text-teal-400">IMANE.EXE</h1>
              <p className="text-xs text-zinc-500">// ADMIN CONSOLE</p>
            </div>

            {/* Right: User Info + Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">
                Logged in as:{" "}
                <span className="text-teal-400 font-semibold">
                  {session.username}
                </span>
              </span>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded
                           hover:bg-zinc-600 transition-colors text-sm font-medium"
                >
                  [LOGOUT]
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
