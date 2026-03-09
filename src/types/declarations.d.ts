declare module "@clerk/nextjs" {
  export const ClerkProvider: any;
  export const SignIn: any;
  export const SignUp: any;
  export const UserButton: any;
  export const SignOutButton: any;
  export const useUser: () => any;
  export const useAuth: () => any;
}

declare module "@clerk/nextjs/server" {
  export const auth: () => Promise<{ userId: string | null }>;
  export const currentUser: () => Promise<any>;
  export const clerkMiddleware: (handler: any) => any;
  export const createRouteMatcher: (patterns: string[]) => any;
}

declare module "@tanstack/react-query" {
  export const QueryClient: any;
  export const QueryClientProvider: any;
}
