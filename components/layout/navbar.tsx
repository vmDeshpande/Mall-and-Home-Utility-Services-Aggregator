"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Package, User, Wrench } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<any>(null);
  const debounceRef = useRef<any>(null);
  const locationRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setSuggestions([]);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔐 Load user
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser(); // initial load

    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  // 📍 Load location
  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed.name);
      } catch {
        setLocation(savedLocation);
      }
    }
  }, []);

  // 🌊 Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ❌ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔗 Nav links
  const navLinks = [
    { href: "/providers", label: "Find Services" },

    ...(user && user.role === "user"
      ? [{ href: "/tracking", label: "Track Bookings" }]
      : []),

    ...(user?.role === "provider"
      ? [{ href: "/provider/dashboard", label: "Provider Dashboard" }]
      : []),

    ...(user?.role === "admin"
      ? [{ href: "/admin/dashboard", label: "Admin Dashboard" }]
      : []),
  ];

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("authChanged"));

    window.location.href = "/";
  };

  // 📍 Detect current location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      );

      const data = await res.json();

      const place =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "Current Location";

      setLocation(place);

      localStorage.setItem(
        "location",
        JSON.stringify({
          name: place,
          lat: latitude,
          lng: longitude,
        }),
      );
    });
  };

  // 🔎 Fetch suggestions
  const fetchLocations = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoadingLocation(true);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`,
    );

    const data = await res.json();
    setSuggestions(data);
    setLoadingLocation(false);
  };

  // ⌨️ Handle input (debounced)
  const handleInputChange = (value: string) => {
    setLocation(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchLocations(value);
    }, 400);
  };

  const iconMap: Record<string, any> = {
    "/providers": Wrench,
    "/tracking": Package,
  };

  return (
    <motion.nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-border/50 bg-background/95 backdrop-blur shadow-sm"
          : "border-b border-border/0 bg-background/50 backdrop-blur"
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <motion.div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white font-bold">
              S
            </motion.div>
            <span className="hidden sm:inline font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ServiceHub
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* 📍 Location */}
            <div
              ref={locationRef}
              className="relative flex items-center gap-2 border rounded-lg px-3 py-1.5"
            >
              <MapPin
                className="h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={detectLocation}
              />

              <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => handleInputChange(e.target.value)}
                className="bg-transparent outline-none text-sm w-32"
              />

              {/* Dropdown */}
              {(suggestions.length > 0 || loadingLocation) && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-background border rounded-lg shadow-lg z-50">
                  {loadingLocation && (
                    <div className="p-2 text-sm">Searching...</div>
                  )}

                  {suggestions.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        const name = item.display_name
                          .split(",")
                          .slice(0, 2)
                          .join(",");
                        setLocation(name);

                        localStorage.setItem(
                          "location",
                          JSON.stringify({
                            name,
                            lat: item.lat,
                            lng: item.lon,
                          }),
                        );

                        setSuggestions([]);
                      }}
                      className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                    >
                      {item.display_name.split(",").slice(0, 2).join(",")}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            {navLinks.map((link) => {
              const Icon = iconMap[link.href];

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm hover:text-primary flex items-center gap-1"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            ) : (
              <div ref={userMenuRef} className="relative">
                {/* Avatar Button */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full border hover:bg-muted transition"
                >
                  <User className="h-5 w-5" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
                    {/* Profile */}
                    <Link href="/profile">
                      <div
                        onClick={() => setUserMenuOpen(false)}
                        className="px-4 py-2 text-sm hover:bg-muted cursor-pointer"
                      >
                        Profile
                      </div>
                    </Link>

                    {/* Divider */}
                    <div className="border-t" />

                    {/* Logout */}
                    <div
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-4 py-2 text-sm text-red-500 hover:bg-muted cursor-pointer"
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 space-y-2">
            <input
              value={location}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter location"
              className="w-full px-3 py-2 border rounded"
            />

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2"
              >
                {link.label}
              </Link>
            ))}

            {!user ? (
              <>
                <Link href="/auth/login">Login</Link>
                <Link href="/auth/signup">Signup</Link>
              </>
            ) : (
              <>
                <Link href="/profile" className="block px-3 py-2">
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="block px-3 py-2 text-left text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
}
