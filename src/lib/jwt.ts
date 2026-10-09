import crypto from "crypto";

// En un proyecto real, esto vive en .env.local y NUNCA se sube a Git.

const SECRET = process.env.JWT_SECRET ?? "dev-secret-no-usar-en-produccion";

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    exp: number; // segundos desde epoch (igual que un JWT real)
}

function base64url(input: string): string {
    return Buffer.from(input).toString("base64url");
}

    // Firma un token: Header.Payload.Signature — exactamente las 3 partes
    // que vimos en la presentación
    export function signToken(
        payload: Omit<JwtPayload, "exp">,
        ttlSeconds = 60 * 15 // 15 minutos, como el Access Token "de vida corta"
    ): string {

    const header = { alg: "HS256", typ: "JWT" };
    const fullPayload: JwtPayload = {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    };
    const headerB64 = base64url(JSON.stringify(header));
    const payloadB64 = base64url(JSON.stringify(fullPayload));
    const signature = crypto
        .createHmac("sha256", SECRET)
        .update(`${headerB64}.${payloadB64}`)
        .digest("base64url");
        return `${headerB64}.${payloadB64}.${signature}`;
}

// Verifica la firma y la expiración. Si algo no cuadra, regresa null.
// IMPORTANTE: usa el módulo "crypto" de Node, que NO existe en el Edge
// Runtime — por eso esta función nunca se llama desde proxy.ts.

export function verifyToken(token: string): JwtPayload | null {
    console.log(token);
    const parts = token.split(".");
    if (parts.length !== 3) return null;
        const [headerB64, payloadB64, signature] = parts;
        const expected = crypto
            .createHmac("sha256", SECRET)
            .update(`${headerB64}.${payloadB64}`)
            .digest("base64url");

            // Firma invalida: alguien modifico el token, o no lo generamos nosotros.
        if (signature !== expected) return null;
        const payload = JSON.parse(
        Buffer.from(payloadB64, "base64url").toString()
    ) as JwtPayload;

    
    // Token vencido.
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}