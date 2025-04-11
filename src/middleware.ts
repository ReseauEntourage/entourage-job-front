import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest): NextResponse {
  // retrieve the current response
  const res = NextResponse.next();

  // add the CORS headers to the response
  res.headers.append('Access-Control-Allow-Credentials', 'true');
  // Récupérer l'origine de la requête (Origin header)
  const origin = req.headers.get('Origin') || '';

  // Vérifier si l'origine fait partie des valeurs autorisées
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_SERVER_URL,
    process.env.NEXT_PUBLIC_CDN_URL,
  ];

  if (allowedOrigins.includes(origin)) {
    res.headers.append('Access-Control-Allow-Origin', origin);
  }
  res.headers.append(
    'Access-Control-Allow-Methods',
    'GET,DELETE,PATCH,POST,PUT'
  );
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  return res;
}
