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

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
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
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ email, password, name }),
        }
      );

      login(data.access_token, {
        id: data.user_id,
        email: data.email,
        name: data.name,
      });

      router.push("/app/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
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
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Join TripSage to coordinate multi-agent travel intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-950/50 border border-red-800/80 p-3 text-xs text-red-200">
                {error}
              </div>
            )}
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Walker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-stone-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-amber-400 hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
