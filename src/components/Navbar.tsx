'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Home, Package, Hammer, LayoutDashboard, LogOut, UserCircle, Book } from 'lucide-react'

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth()

  useEffect(() => {
    console.log('Navbar rendered. User:', user?.email, 'Is admin:', isAdmin)
  }, [user, isAdmin])

  const getDashboardLink = () => {
    if (isAdmin) return '/admin-dashboard'
    return '/fitter-dashboard'
  }

  const customerLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/standard', label: 'Standard', icon: Package },
    { href: '/max', label: '4Max', icon: Package },
    { href: '/in-the-trade', label: 'In the Trade?', icon: Hammer },
  ]

  const fitterLinks = [
    { href: getDashboardLink(), label: 'Dashboard', icon: LayoutDashboard },
    { href: '/fitter-dashboard/manage-profile', label: 'Projects', icon: UserCircle },
    { href: '/fitter/knowledge-base', label: 'Knowledge Base', icon: Book }, // New Knowledge Base link
  ]

  const navLinks = user ? fitterLinks : customerLinks

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/headerlogo.png"
            alt="Company Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/20 flex items-center space-x-2">
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Button>
            </Link>
          ))}
          {user && (
            <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/20 flex items-center space-x-2" onClick={logout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="text-primary-foreground border-primary-foreground">
              <Menu className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-primary text-primary-foreground">
            {navLinks.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href} className="w-full px-2 py-2 text-sm hover:bg-primary-foreground/20 flex items-center space-x-2">
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            {user && (
              <DropdownMenuItem onClick={logout} className="w-full px-2 py-2 text-sm hover:bg-primary-foreground/20 flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default Navbar