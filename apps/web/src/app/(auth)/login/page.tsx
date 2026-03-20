"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-white p-4">
      <div className="w-full max-w-[400px] animate-slideUp">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-capiro-blue">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Sign in to Capiro
          </h1>
          <p className="mt-2 text-sm text-cool-grey">
            Agentic Congressional Workflows
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-signal-blue hover:text-signal-blue-hover transition-colors duration-150"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <Button type="submit" variant="accent" className="w-full">
              Sign in
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-cool-grey">
              or
            </span>
          </div>

          {/* SSO */}
          <Button variant="outline" className="w-full gap-2">
            <Building2 className="h-4 w-4" />
            Continue with SSO
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-cool-grey">
          Don&apos;t have an account?{" "}
          <Link
            href="/contact-sales"
            className="font-medium text-signal-blue hover:text-signal-blue-hover transition-colors duration-150"
          >
            Contact sales
          </Link>
        </p>
      </div>
    </div>
  );
}
