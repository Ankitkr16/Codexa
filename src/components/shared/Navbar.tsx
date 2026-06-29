"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Codexa<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-white transition-colors">
              FAQ
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-primary text-white px-4 h-9 flex items-center justify-center rounded-lg hover:bg-primary/95 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-primary/20"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-white/5 bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="#features"
              onClick={() => setIsOpen(false)}
              className="text-sm text-muted-foreground hover:text-white transition-colors py-2"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              onClick={() => setIsOpen(false)}
              className="text-sm text-muted-foreground hover:text-white transition-colors py-2"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setIsOpen(false)}
              className="text-sm text-muted-foreground hover:text-white transition-colors py-2"
            >
              FAQ
            </Link>
          </div>
          <div className="border-t border-white/5 pt-4 flex flex-col space-y-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-center text-muted-foreground hover:text-white transition-colors py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-center bg-primary text-white py-2.5 rounded-lg hover:bg-primary/95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
