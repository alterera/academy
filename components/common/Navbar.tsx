"use client";

import * as React from "react";
import Link from "next/link";
import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  Menu,
  X,
  User,
  BookOpen,
  LogOut,
  ChevronDown,
  Braces,
  Code,
  Cloud,
  DatabaseZap,
  Figma,
  Gpu,
  EllipsisVertical,
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
import { useAuth } from "@/lib/auth/context";

export default function Navbar() {
  const isMobile = useIsMobile();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [authModalTab, setAuthModalTab] = React.useState<"login" | "signup">(
    "login"
  );
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  // Disable body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

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
    closeMobileMenu();
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    closeMobileMenu();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.phone?.slice(-2) || "U";
  };

  // User dropdown menu component
  const UserDropdown = ({
    isMobileView = false,
  }: {
    isMobileView?: boolean;
  }) => (
    <div
      className={`relative ${isMobileView ? "w-full" : ""}`}
      ref={isMobileView ? undefined : userMenuRef}
    >
      <button
        onClick={() => (isMobileView ? null : setUserMenuOpen(!userMenuOpen))}
        className={`flex items-center gap-2 ${
          isMobileView
            ? "w-full justify-between py-3 border-b"
            : "bg-[#00E785] rounded-xl px-3 py-1.5 font-semibold hover:bg-[#00d675] transition-colors"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center rounded-full bg-black text-white font-medium ${
              isMobileView ? "w-10 h-10 text-base" : "w-7 h-7 text-xs"
            }`}
          >
            {getUserInitials()}
          </div>
          {isMobileView && (
            <div className="text-left">
              <p className="font-semibold">{user?.name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.phone}</p>
            </div>
          )}
        </div>
        {!isMobileView && <ChevronDown className="h-4 w-4" />}
      </button>

      {/* Desktop dropdown */}
      {!isMobileView && userMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
          <div className="px-4 py-2 border-b">
            <p className="font-medium truncate">{user?.name || "User"}</p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.phone}
            </p>
          </div>
          <Link
            href="/profile"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors w-full text-left text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}

      {/* Mobile menu items */}
      {isMobileView && (
        <div className="flex flex-col mt-4 space-y-2">
          <Link
            href="/profile"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 py-2 text-base"
          >
            <User className="h-5 w-5 text-muted-foreground" />
            Profile
          </Link>
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 py-2 text-base"
          >
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2 text-base text-red-600"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full shadow-xs sticky top-0 bg-white z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto py-4 px-4 md:px-8">
        <Link href="/">
          <Image src={"/logo-black.svg"} height={100} width={150} alt="logo" />
        </Link>

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

            <NavigationMenuItem>
            <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/courses">Courses</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <div className="flex gap-5 ml-10">
            {isLoading ? (
              <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-xl" />
            ) : isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
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
              </>
            )}
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
        <div className="flex flex-col h-full w-full pt-20 px-6 overflow-y-auto">
          {/* Mobile Menu Links */}
          <nav className="flex flex-col space-y-6">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-xl font-semibold py-2 border-b"
            >
              Home
            </Link>

            <Link
              href={"/courses"}
              onClick={closeMobileMenu}
              className="text-xl font-semibold py-2 border-b"
            >
              Courses
            </Link>

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-xl font-semibold py-2 border-b"
            >
              About
            </Link>
          </nav>

          {/* Mobile Auth/User Section */}
          <div className="flex flex-col gap-4 mt-8">
            {isLoading ? (
              <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
            ) : isAuthenticated ? (
              <UserDropdown isMobileView />
            ) : (
              <>
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
              </>
            )}
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
