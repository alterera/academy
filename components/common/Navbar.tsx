"use client";

import * as React from "react";
import Link from "next/link";
import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  Menu,
  X,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { AuthModal } from "@/components/AuthModal";


export default function Navbar() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [authModalTab, setAuthModalTab] = React.useState<"login" | "signup">("login");

  // Disable body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleAuthClick = (type: "login" | "signup") => {
    setAuthModalTab(type);
    setAuthModalOpen(true);
    closeMobileMenu(); // Close mobile menu if open
  };

  return (
    <div className="w-full shadow-xs sticky top-0 bg-white z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto py-4 px-4 md:px-8">
        <Image src={"/logo-black.svg"} height={100} width={150} alt="logo" />

        {/* Desktop Navigation */}
        <NavigationMenu viewport={isMobile} className="hidden md:flex">
          <NavigationMenuList className="flex-wrap">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">
                        <div className="font-medium">Components</div>
                        <div className="text-muted-foreground">
                          Browse all components in the library.
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">
                        <div className="font-medium">Documentation</div>
                        <div className="text-muted-foreground">
                          Learn how to use the library.
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">
                        <div className="font-medium">Blog</div>
                        <div className="text-muted-foreground">
                          Read our latest blog posts.
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem> */}

            <NavigationMenuItem>
              <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#" className="flex-row items-center gap-2">
                        <CircleHelpIcon />
                        Backlog
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#" className="flex-row items-center gap-2">
                        <CircleIcon />
                        To Do
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#" className="flex-row items-center gap-2">
                        <CircleCheckIcon />
                        Done
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/">Pricing</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <div className="flex gap-5 ml-10">
            <button
              onClick={() => handleAuthClick("login")}
              className="border-2 border-black rounded-2xl px-4 py-1 font-bold hover:bg-gray-50 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => handleAuthClick("signup")}
              className="bg-[#00E785] rounded-xl px-4 py-1 font-bold hover:bg-[#00d675] transition-colors"
            >
              Signup
            </button>
          </div>
        </NavigationMenu>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 z-50 relative"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-white z-40 md:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-[120%]"
        }`}
      >
        <div className="flex flex-col h-full w-full pt-20 px-6">
          {/* Mobile Menu Links */}
          <nav className="flex flex-col space-y-6">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-xl font-semibold py-2 border-b"
            >
              Home
            </Link>

            {/* <div className="py-2 border-b">
              <p className="text-xl font-semibold mb-3">Features</p>
              <div className="flex flex-col space-y-3 pl-4">
                <Link
                  href="#"
                  onClick={closeMobileMenu}
                  className="text-base text-muted-foreground"
                >
                  Components
                </Link>
                <Link
                  href="#"
                  onClick={closeMobileMenu}
                  className="text-base text-muted-foreground"
                >
                  Documentation
                </Link>
                <Link
                  href="#"
                  onClick={closeMobileMenu}
                  className="text-base text-muted-foreground"
                >
                  Blog
                </Link>
              </div>
            </div> */}

            <div className="py-2 border-b">
              <p className="text-xl font-semibold mb-3">Courses</p>
              {/* <div className="flex flex-col space-y-3 pl-4">
                <Link
                  href="#"
                  onClick={closeMobileMenu}
                  className="text-base text-muted-foreground flex items-center gap-2"
                >
                  <CircleHelpIcon className="h-4 w-4" />
                  Backlog
                </Link>
                <Link
                  href="#"
                  onClick={closeMobileMenu}
                  className="text-base text-muted-foreground flex items-center gap-2"
                >
                  <CircleIcon className="h-4 w-4" />
                  To Do
                </Link>
                <Link
                  href="#"
                  onClick={closeMobileMenu}
                  className="text-base text-muted-foreground flex items-center gap-2"
                >
                  <CircleCheckIcon className="h-4 w-4" />
                  Done
                </Link>
              </div> */}
            </div>

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-xl font-semibold py-2 border-b"
            >
              Pricing
            </Link>
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => handleAuthClick("login")}
              className="border-2 border-black rounded-2xl px-6 py-3 font-bold text-lg hover:bg-gray-50 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => handleAuthClick("signup")}
              className="bg-[#00E785] rounded-xl px-6 py-3 font-bold text-lg hover:bg-[#00d675] transition-colors"
            >
              Signup
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
