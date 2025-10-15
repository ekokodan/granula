import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isNewDesign = location.pathname === "/" || location.pathname === "/landing/new";

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/assets/Layer 1.svg" 
              alt="Granula" 
              className="h-8 w-auto" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 border border-border rounded-md p-1">
              <Link to="/landing/classic">
                <Button variant={!isNewDesign ? "secondary" : "ghost"} size="sm">
                  Classic
                </Button>
              </Link>
              <Link to="/">
                <Button variant={isNewDesign ? "secondary" : "ghost"} size="sm">
                  New Design
                </Button>
              </Link>
            </div>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="cta" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-accent"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col gap-2 pt-4">
              <div className="text-xs text-muted-foreground px-2 py-1">Landing Page</div>
              <Link to="/landing/classic" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant={!isNewDesign ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
                  Classic
                </Button>
              </Link>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant={isNewDesign ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
                  New Design
                </Button>
              </Link>
              <div className="text-xs text-muted-foreground px-2 py-1 mt-2">Account</div>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="cta" size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};