export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Next.js
      ANALYZE: string;

      // Database
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: string;
      SUPABASE_DATABASE_DIRECT_IPV6: string;
      SUPABASE_DATABASE_TRANSACTION_POOLER: string;
      SUPABASE_DATABASE_SESSION_POOLER_NOT_RECOMMENDED: string;

      // Posthog
      NEXT_PUBLIC_POSTHOG_KEY: string;
      NEXT_PUBLIC_POSTHOG_HOST_API: string;
      NEXT_PUBLIC_POSTHOG_HOST_UI: string;

      // Auth
      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;
      HCA_CLIENT_ID: string;
      HCA_CLIENT_SECRET: string;

      // Pre-Production Password
      NEXT_PUBLIC_PREPRODUCTION_PASSWORD: string;

      // Vercel-provided system vars
      NEXT_PUBLIC_VERCEL_ENV: "production" | "preview" | "development";
      NEXT_PUBLIC_VERCEL_TARGET_ENV: string;
      NEXT_PUBLIC_VERCEL_URL: string;
      NEXT_PUBLIC_VERCEL_BRANCH_URL: string;
      NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: string;
      NEXT_PUBLIC_VERCEL_REGION: string;
      NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID: string;
      NEXT_PUBLIC_VERCEL_PROJECT_ID: string;
      NEXT_PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET?: string;

      // Git metadata
      NEXT_PUBLIC_VERCEL_GIT_PROVIDER: "github" | "gitlab" | "bitbucket";
      NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG: string;
      NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER: string;
      NEXT_PUBLIC_VERCEL_GIT_REPO_ID: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME: string;
      NEXT_PUBLIC_VERCEL_GIT_PREVIOUS_SHA?: string;
      NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID?: string;
    }
  }
}
