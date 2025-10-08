"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { User, CreditCard, Radio, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function AppSidebar() {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab") ?? "plan"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Dashboard"
                  isActive={currentTab === "dashboard"}
                  className="data-[active=true]:bg-muted data-[active=true]:text-foreground"
                >
                  <Link href="/dashboard?tab=dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Perfil"
                  isActive={currentTab === "perfil"}
                  className="data-[active=true]:bg-muted data-[active=true]:text-foreground"
                >
                  <Link href="/dashboard?tab=perfil">
                    <User />
                    <span>Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Plano e Faturamento"
                  isActive={currentTab === "plan"}
                  className="data-[active=true]:bg-muted data-[active=true]:text-foreground"
                >
                  <Link href="/dashboard?tab=plan">
                    <CreditCard />
                    <span>Plano e Faturamento</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Acessar Estações">
                  <a
                    href="https://agroclima.net/sbadmin2/perfil.php"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Radio />
                    <span>Acessar Estações</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}