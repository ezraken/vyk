import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" data-testid="layout">
      <Navbar />
      <main className="flex-1" data-testid="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
