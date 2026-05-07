import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-gray-900/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
            <img src="/favicon.svg" alt="Techofy Logo" className="w-full h-full object-contain" />
          </div>
          Techofy Cloud
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/terms" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Terms
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 text-sm">
                <span className="text-gray-400">Wallet:</span>
                <span className="font-medium text-secondary">
                  {/* Currency ₹ set kar di hai tere logic ke hisab se */}
                  ₹{user.walletBalance?.toFixed(2) || "0.00"}
                </span>
              </div>
              <Link href={user.role === 'ADMIN' ? "/admin" : "/dashboard"} className="text-sm font-medium text-white hover:text-gray-200">
                Dashboard
              </Link>
              <Button variant="ghost" onClick={logout} className="text-gray-300 hover:text-white hover:bg-gray-800">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
