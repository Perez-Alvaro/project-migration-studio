import { Link } from "@tanstack/react-router";
import { UserRound, LayoutDashboard, GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountButton() {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) return <span className="w-10 h-10" aria-hidden="true" />;

  if (!user) {
    return (
      <Link
        to="/auth"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Ingresar a mi cuenta"
      >
        <UserRound size={18} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold"
        aria-label="Abrir menú de mi cuenta"
      >
        {(user.email ?? "?").slice(0, 1).toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <LayoutDashboard size={16} aria-hidden="true" /> Panel de administración
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/mis-talleres">
            <GraduationCap size={16} aria-hidden="true" /> Mis talleres
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut size={16} aria-hidden="true" /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
