"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, GalleryItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

export function NavbarMenu() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState("bg-gray-300");

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/ping-gpt');
      if (response.ok) {
        setStatusColor("bg-green-300");
      } else {
        setStatusColor("bg-red-400");
      }
    } catch (error) {
      setStatusColor("bg-red-400");
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <ul>Cut & Trim</ul>
            <ul>Hair Wash</ul>
            <ul>Hair Dye</ul>
            <ul>Partial Highlights</ul>
            <ul>Color Retouch</ul>
            <ul>Perm & Straightened</ul>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Gallery">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <GalleryItem
              title="Gallery #1"
              href="#"
              src=""
              description=""
            />
            <GalleryItem
              title="Gallery #2"
              href="#"
              src=""
              description=""
            />
            <GalleryItem
              title="Gallery #3"
              href="#"
              src=""
              description=""
            />
            <GalleryItem
              title="Gallery #4"
              href="#"
              src=""
              description=""
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Contact">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="#">Location</HoveredLink>
            <HoveredLink href="#">Contact Info</HoveredLink>
          </div>
        </MenuItem>
        <a className="relative inline-flex items-center text-zinc-800">
          Assistant Status
          <span className={`relative top-[1.5] -right-2 h-3 w-3 ${statusColor} rounded-full shadow-md`}></span>
        </a>
      </Menu>
    </div>
  );
}
