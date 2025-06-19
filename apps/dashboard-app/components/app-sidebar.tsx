"use client"

import React from 'react'
import {
  Home,
  ShoppingCart,
  Truck,
  Users,
  FileText,
  Package,
  Boxes,
  Settings,
  Zap,
  ChevronUp,
  User2,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppSidebarProps {
  userType?: 'retailer' | 'distributor' | 'admin'
}

export function AppSidebar({ userType = 'distributor' }: AppSidebarProps) {
  const pathname = usePathname()
  const { state } = useSidebar()

  // Define navigation items based on user type
  const getNavigationItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: 'Dashboard',
        path: `/${userType}/home`,
        active: pathname === `/${userType}/home`,
      },
      {
        icon: ShoppingCart,
        label: 'Orders',
        path: `/${userType}/orders`,
        active: pathname === `/${userType}/orders` || pathname.startsWith(`/${userType}/orders/`),
      },
      {
        icon: Truck,
        label: 'Shipments',
        path: `/${userType}/shipment`,
        active: pathname === `/${userType}/shipment`,
      },
      {
        icon: Users,
        label: 'Customers',
        path: `/${userType}/customers`,
        active: pathname === `/${userType}/customers`,
      },
      {
        icon: FileText,
        label: 'Reports',
        path: `/${userType}/reports`,
        active: pathname === `/${userType}/reports`,
      },
      {
        icon: Settings,
        label: 'Settings',
        path: `/${userType}/settings`,
        active: pathname === `/${userType}/settings`,
      },
    ]

    // Add Products and Inventory only for distributors and admins
    if (userType !== 'retailer') {
      baseItems.splice(1, 0, 
        {
          icon: Package,
          label: 'Products',
          path: `/${userType}/products`,
          active: pathname === `/${userType}/products`,
        },
        {
          icon: Boxes,
          label: 'Inventory',
          path: `/${userType}/inventory`,
          active: pathname === `/${userType}/inventory`,
        }
      )
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/${userType}/home`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image 
                    src="/black-logo-kitions.svg"
                    alt="Kitions Logo" 
                    width={24}
                    height={24}
                    className="size-6"
                    priority
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Kitions</span>
                  <span className="truncate text-xs">
                    {userType === 'retailer' ? 'Retailer Dashboard' : 
                     userType === 'admin' ? 'Admin Dashboard' : 
                     'Distributor Dashboard'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link href={item.path}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Upgrade Section - only show when collapsed */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 text-white">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-white/20 rounded-lg mr-3">
                    <Zap size={16} className="text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm">Upgrade to Pro</h3>
                </div>
                <p className="text-white/80 text-xs mb-4 leading-relaxed">
                  Unlock advanced analytics, unlimited products, and priority support.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 bg-white text-slate-800 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Upgrade Now
                </motion.button>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <User2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">User Account</span>
                    <span className="truncate text-xs">Manage your account</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
} 