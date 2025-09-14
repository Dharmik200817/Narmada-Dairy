import React from "react";
import AccountMenu from "./AccountMenu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="w-full p-4 bg-white shadow flex justify-end">
        <div className="container mx-auto">
          <AccountMenu />
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
