import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define a route matcher for protected routes
const isProtectedRoute = createRouteMatcher([
  "/catbot(.*)", // Protect all routes that start with /catbot
]);

export default clerkMiddleware((auth, req) => {
  // Protect routes based on the defined matcher
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Exclude static assets and other Next.js special routes
    "/((?!.*\\..*|_next).*)",
    "/", // Include root but it won't be protected as per logic
    "/(api|trpc)(.*)",
  ],
};
