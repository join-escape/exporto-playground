"use client";
import { FiLogOut } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onOpenAuthModal: () => void;
}

export function Header({ onOpenAuthModal }: HeaderProps) {
  const { user, logout } = useAuth();

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Exporto
            <sup className="text-sm align-baseline ml-1">beta</sup>
          </h1>
        </div>

        <div className="flex items-center">
          {/* Links group */}
          <div className="flex items-center space-x-4 mr-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              blog
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              catalog
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              github
            </a>
          </div>

          {/* Theme toggle (standalone) */}
          <div className="mx-4">
            <ThemeToggle />
          </div>

          {/* Auth buttons group */}
          <div className="flex items-center space-x-2 ml-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-8 w-8">
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.name || "User"} />
                    ) : null}
                    <AvatarFallback>
                      {getInitials(user.name || "User")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => logout()}>
                    <FiLogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenAuthModal}
                  className="cursor-pointer"
                >
                  signup
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenAuthModal}
                  className="cursor-pointer"
                >
                  login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
