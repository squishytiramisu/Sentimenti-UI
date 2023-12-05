
"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { User } from "lucide-react"
import { useEffect, useState } from "react"





export function SiteHeader() {

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      let username = localStorage.getItem('sentimentiUsername');
      
      if (username) {
        setUsername(username);
      }


    }
  }, []);


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
          <Link href="/login" className="flex items-center space-x-2"> 
            <span className="inline-block font-bold">{username ? username: "Login"}</span>   
            <User />
          </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
