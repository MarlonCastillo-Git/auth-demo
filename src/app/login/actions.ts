"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken } from "@/lib/jwt";

const USERS = [{ email: "admin@kodigo.com", password: "123456", role: "admin" }];


export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) redirect("/login?error=1");

  const token = signToken({ sub: user.email, email: user.email, role: user.role }, 60 * 15);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}