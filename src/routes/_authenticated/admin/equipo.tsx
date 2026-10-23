import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AdminHeader, Panel, errorText } from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/admin/equipo")({ component: Team });

function Team() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["admin", "team"],
    queryFn: async () => (await supabase.rpc("list_admins")).data ?? [],
  });

  async function add(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.rpc("set_admin", { _email: email, _make_admin: true });
    if (error) return toast.error(errorText(error));
    toast.success("Le dimos acceso al panel.");
    setEmail("");
    refetch();
  }

  async function remove(mail: string) {
    if (!confirm(`¿Quitar el acceso al panel a ${mail}?`)) return;
    const { error } = await supabase.rpc("set_admin", { _email: mail, _make_admin: false });
    if (error) return toast.error(errorText(error));
    refetch();
  }

  return (
    <>
      <AdminHeader title="Equipo" description="Todas las personas del equipo tienen acceso completo al panel." />
      <Panel className="max-w-2xl space-y-5">
        <form onSubmit={add} className="space-y-2">
          <label htmlFor="team-email" className="text-sm font-medium">Sumar a alguien del equipo</label>
          <div className="flex gap-2">
            <Input id="team-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
            <button type="submit" className="btn-pill btn-primary-gradient !py-2 text-sm shrink-0">Dar acceso</button>
          </div>
          <p className="text-xs text-muted-foreground">La persona primero tiene que crear su cuenta en la página de ingreso.</p>
        </form>
        <ul className="divide-y divide-border">
          {(data ?? []).map((a) => (
            <li key={a.user_id} className="flex items-center justify-between gap-2 py-2.5">
              <span className="text-sm"><strong>{a.full_name || "Sin nombre"}</strong> <span className="text-muted-foreground">{a.email}</span></span>
              {a.user_id !== user?.id && a.email && (
                <button type="button" onClick={() => remove(a.email!)} className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">Quitar acceso</button>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
