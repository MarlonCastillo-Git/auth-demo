import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log ("PROXY ", pathname);

    // 1) redirect clásico, URL vieja -> URL nueva con cambio permanente
    if (pathname.startsWith("/september-promo")){
        return NextResponse.redirect(new URL("/october-promo", request.url));
    }

    // 2) rewrite: la URL visible no cambia, pero el contenido si ---
    if (pathname.startsWith("/beta")) {
        return NextResponse.rewrite(new URL("/nuevo-feature", request.url));
    }

    // 3) Protección de rutas basadas en cookie
    const token = request.cookies.get("session")?.value;
    const isProtectedRoute = pathname.includes("/dashboard");

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();

}

export const config = {
    matcher: ["/dashboard/:path*", "/september-promo/:path*", "/beta/:path*"],
};