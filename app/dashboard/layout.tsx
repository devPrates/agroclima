"use client"

import { ReactNode, useEffect, useState, Suspense } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/signout-button"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <SidebarProvider>
      <Suspense fallback={<div className="p-4"><span className="text-muted-foreground">Carregando navegação...</span></div>}>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <div className="p-4">
          {/* Navbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}
              <SignOutButton />
            </div>
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}