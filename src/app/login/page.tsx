import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Verificación completa (Node Runtime): si ya tienes una sesión VÁLIDA,
  // no tiene sentido mostrar el formulario de login otra vez.
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = token ? verifyToken(token) : null;
  if (payload) {
    redirect("/dashboard");
  }
  // Si el token existe pero es inválido/expirado, payload es null y
  // seguimos de largo para mostrar el formulario — sin esto, una cookie
  // corrupta dejaría a la persona atrapada en un loop de redirects.

  const { error } = await searchParams;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-stone-900">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-stone-500">admin@kodigo.com / 123456</p>
      </div>

      <form action={loginAction} className="w-full max-w-sm space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Correo</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            placeholder="admin@kodigo.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Contraseña</label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-rose-600">Correo o contraseña incorrectos.</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}