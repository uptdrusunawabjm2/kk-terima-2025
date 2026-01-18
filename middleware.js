export default function middleware(request) {
  const url = new URL(request.url);

  // 🔓 publik
  if (url.pathname === "/" || url.pathname === "/index.html") {
    return fetch(request);
  }

  // 🔐 kunci semua /detail
  if (url.pathname.startsWith("/detail")) {
    const auth = request.headers.get("authorization");

    if (auth) {
      const base64 = auth.split(" ")[1];
      const [user, pass] = atob(base64).split(":");

      if (
        user === process.env.BASIC_AUTH_USER &&
        pass === process.env.BASIC_AUTH_PASS
      ) {
        return fetch(request);
      }
    }

    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected Dashboard"',
      },
    });
  }

  return fetch(request);
}