"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";
import { Compass } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiClient<{ access_token: string; user_id: string; email: string; name: string | null }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );

      login(data.access_token, {
        id: data.user_id,
        email: data.email,
        name: data.name,
      });

      router.push("/app/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 p-4">
      <div className="mb-8 flex items-center space-x-2">
        <Compass className="h-8 w-8 text-sage-400" />
        <span className="font-display text-2xl font-bold tracking-tight text-white">TRIPSAGE<span className="text-amber-500">.AI</span></span>
      </div>

      <Card className="w-full max-w-md border-stone-800 bg-stone-900/90">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to access your planned trips and itineraries</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-950/50 border border-red-800/80 p-3 text-xs text-red-200">
                {error}
              </div>
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="gold" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-stone-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-stone-900 px-2 text-stone-500">Or continue without password</span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full border-amber-500/30 hover:border-amber-500/60 text-amber-300"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                const data = await apiClient<{ access_token: string; user_id: string; email: string; name: string | null }>(
                  "/auth/guest",
                  { method: "POST" }
                );
                login(data.access_token, {
                  id: data.user_id,
                  email: data.email,
                  name: data.name,
                });
                router.push("/app/dashboard");
              } catch (err: any) {
                setError(err.message || "Failed to start guest session");
              } finally {
                setLoading(false);
              }
            }}
          >
            ⚡ Instant Demo Access (Guest Mode)
          </Button>

          <div className="mt-6 text-center text-xs text-stone-400">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-amber-400 hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
