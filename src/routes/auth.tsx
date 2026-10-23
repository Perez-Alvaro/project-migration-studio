import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({ redirect: z.string().optional() });

function safeRedirect(value: string | undefined): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Ingresar | Centro Educativo Terapéutico Haruén" },
      { name: "description", content: "Ingresá o creá tu cuenta para inscribirte en los talleres virtuales de Haruén." },
      { property: "og:title", content: "Ingresar | Haruén" },
      { property: "og:description", content: "Accedé a tus talleres virtuales y materiales." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const { redirect } = Route.useSearch();
  const target = safeRedirect(redirect);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      let to = target;
      if (!redirect || to === "/") {
        const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
        if (data === true) to = "/admin";
      }
      if (active) navigate({ to, replace: true });
    })();
    return () => {
      active = false;
    };
  }, [user, target, redirect, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error("El correo o la contraseña no coinciden. Revisalos y probá de nuevo.");
      } else if (mode === "signup") {
        if (password.length < 8) throw new Error("La contraseña necesita al menos 8 caracteres.");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + target, data: { full_name: fullName } },
        });
        if (error) throw new Error(error.message);
        setSent("Te enviamos un correo para confirmar tu cuenta. Abrilo y volvé a ingresar.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw new Error(error.message);
        setSent("Si el correo está registrado, vas a recibir un enlace para crear una nueva contraseña.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo falló. Probá de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    if (target !== "/") sessionStorage.setItem("haruen-after-login", target);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("No pudimos conectar con Google. Probá de nuevo.");
  }

  const title = mode === "signin" ? "Ingresar" : mode === "signup" ? "Crear cuenta" : "Recuperar contraseña";

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-16">
      <div className="haruen-container max-w-md">
        <div className="haruen-card">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">
            {mode === "signup"
              ? "Creá tu cuenta para inscribirte en los talleres virtuales."
              : mode === "forgot"
                ? "Escribí tu correo y te enviamos un enlace."
                : "Accedé a tus talleres y materiales."}
          </p>

          {sent ? (
            <p role="status" className="rounded-xl bg-muted p-4 text-sm">{sent}</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="full-name">Nombre y apellido</Label>
                  <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={mode === "signup" ? 8 : undefined}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                </div>
              )}
              <button type="submit" disabled={busy} className="btn-pill btn-primary-gradient w-full disabled:opacity-60">
                {busy ? "Un momento…" : mode === "signin" ? "Ingresar" : mode === "signup" ? "Crear mi cuenta" : "Enviar enlace"}
              </button>
            </form>
          )}

          {mode !== "forgot" && !sent && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> o <span className="h-px flex-1 bg-border" />
              </div>
              <button type="button" onClick={onGoogle} className="btn-pill btn-secondary-neutral w-full">
                Continuar con Google
              </button>
            </>
          )}

          <div className="mt-6 flex flex-col gap-2 text-sm">
            {mode === "signin" && (
              <>
                <button type="button" className="text-left underline underline-offset-4" onClick={() => { setMode("signup"); setSent(null); }}>
                  ¿No tenés cuenta? Creala acá
                </button>
                <button type="button" className="text-left underline underline-offset-4" onClick={() => { setMode("forgot"); setSent(null); }}>
                  Olvidé mi contraseña
                </button>
              </>
            )}
            {mode !== "signin" && (
              <button type="button" className="text-left underline underline-offset-4" onClick={() => { setMode("signin"); setSent(null); }}>
                Ya tengo cuenta, quiero ingresar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
