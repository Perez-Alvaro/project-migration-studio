import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nueva contraseña | Haruén" },
      { name: "description", content: "Creá una nueva contraseña para tu cuenta de Haruén." },
      { property: "og:title", content: "Nueva contraseña | Haruén" },
      { property: "og:description", content: "Creá una nueva contraseña." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("La contraseña necesita al menos 8 caracteres.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error("El enlace venció o ya se usó. Pedí uno nuevo desde «Olvidé mi contraseña».");
      return;
    }
    toast.success("Guardamos tu nueva contraseña.");
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-16">
      <div className="haruen-container max-w-md">
        <form onSubmit={onSubmit} className="haruen-card space-y-4">
          <h1 className="text-3xl font-bold">Nueva contraseña</h1>
          <div className="space-y-1.5">
            <Label htmlFor="new-password">Contraseña nueva</Label>
            <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
          </div>
          <button type="submit" disabled={busy} className="btn-pill btn-primary-gradient w-full disabled:opacity-60">
            {busy ? "Guardando…" : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
