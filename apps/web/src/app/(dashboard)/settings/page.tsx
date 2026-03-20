"use client";

import React from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { label: "Profile", value: "profile" },
  { label: "Organization", value: "organization" },
  { label: "Team", value: "team" },
  { label: "Billing", value: "billing" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("profile");

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-cool-grey">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex items-center gap-1 border-b border-gray-200">
        {settingsTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors duration-150",
              activeTab === tab.value
                ? "text-signal-blue"
                : "text-cool-grey hover:text-gray-900"
            )}
          >
            {tab.label}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-signal-blue rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "profile" && <ProfileSettings />}
      {activeTab === "organization" && <OrganizationSettings />}
      {activeTab === "team" && <TeamSettings />}
      {activeTab === "billing" && <BillingSettings />}
    </PageShell>
  );
}

function ProfileSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>
            This will be displayed on your profile and in team views.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="group relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl">JD</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100 cursor-pointer">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <Button variant="outline" size="sm">
                Upload photo
              </Button>
              <p className="mt-1.5 text-xs text-cool-grey">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Name & Email */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your name and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                First name
              </label>
              <Input defaultValue="Jane" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Last name
              </label>
              <Input defaultValue="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Email address
            </label>
            <Input defaultValue="jane@capiro.io" type="email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Job title
            </label>
            <Input defaultValue="Senior Legislative Analyst" />
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button variant="accent">Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrganizationSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Manage your organization name and settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Organization name
            </label>
            <Input defaultValue="Capiro Government Affairs" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Workspace URL
            </label>
            <div className="flex items-center gap-0">
              <span className="flex h-10 items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-cool-grey">
                app.capiro.io/
              </span>
              <Input
                defaultValue="capiro-gov"
                className="rounded-l-none"
              />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button variant="accent">Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamSettings() {
  const teamMembers = [
    { name: "Jane Doe", email: "jane@capiro.io", role: "Admin", initials: "JD" },
    { name: "Alex Rivera", email: "alex@capiro.io", role: "Editor", initials: "AR" },
    { name: "Sam Chen", email: "sam@capiro.io", role: "Editor", initials: "SC" },
    { name: "Taylor Kim", email: "taylor@capiro.io", role: "Viewer", initials: "TK" },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription className="mt-1">
              Manage who has access to this workspace.
            </CardDescription>
          </div>
          <Button variant="accent" size="sm">
            Invite member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {teamMembers.map((member) => (
              <div
                key={member.email}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-[10px]">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.name}
                    </p>
                    <p className="text-xs text-cool-grey">{member.email}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-cool-grey bg-gray-100 rounded-md px-2 py-1">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are currently on the Professional plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-signal-blue-light bg-signal-blue-light/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Professional
                </p>
                <p className="text-xs text-cool-grey mt-0.5">
                  Up to 25 team members, unlimited submissions
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-900">$299</p>
                <p className="text-xs text-cool-grey">/month</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" size="sm">
              Change plan
            </Button>
            <Button variant="ghost" size="sm" className="text-cool-grey">
              View invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
