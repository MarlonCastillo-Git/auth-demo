import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { logoutAction } from "../login/actions";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  // El proxy ya comprobó que la cookie EXISTE. Aquí, en Node Runtime,
  // hacemos la verificación completa: firma válida + no expirado.
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    // Llega aquí si: no hay cookie, el token fue modificado, o ya expiró.
    // El proxy no puede detectar ninguno de estos dos últimos casos.
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-stone-900">Dashboard</h1>
        <p className="mt-1 text-stone-600">
          Bienvenido, <strong>{payload.email}</strong> — rol: {payload.role}
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
        <p>
          Este token vence a las{" "}
          <strong>{new Date(payload.exp * 1000).toLocaleTimeString()}</strong>.
          Cuando pase esa hora, esta página te va a regresar a /login
          automáticamente, aunque la cookie siga técnicamente presente.
        </p>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}