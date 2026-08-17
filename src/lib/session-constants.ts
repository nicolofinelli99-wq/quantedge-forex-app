// Split out from session.ts so the Edge middleware (which only needs the
// cookie name, not the Node-only signing logic) doesn't pull in node:crypto,
// which the Edge runtime can't bundle.
export const SESSION_COOKIE = "qe_session";
