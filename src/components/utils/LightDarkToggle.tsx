"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export default function LightDarkToggle() {
  const { theme, setTheme } = useTheme();
  const [position, setPosition] = useState(theme || "dark");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={(val) => {
            setTheme(val);
            setPosition(val);
          }}
        >
          <DropdownMenuRadioItem value="dark">
            <div className="flex items-center justify-start gap-3">
              <Moon size={20} />
              <span>Dark</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <div className="flex items-center justify-start gap-3">
              <Sun size={20} />
              <span>Light</span>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
