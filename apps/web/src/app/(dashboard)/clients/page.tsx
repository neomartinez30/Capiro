"use client";

import React from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users } from "lucide-react";

const clients = [
  {
    id: "1",
    name: "Tech Alliance",
    organization: "Technology Industry Association",
    topics: 8,
    lastActivity: "2 hours ago",
    initials: "TA",
    status: "active",
  },
  {
    id: "2",
    name: "GreenFuture Coalition",
    organization: "Environmental Advocacy Group",
    topics: 5,
    lastActivity: "5 hours ago",
    initials: "GC",
    status: "active",
  },
  {
    id: "3",
    name: "Rural Connect PAC",
    organization: "Telecommunications PAC",
    topics: 3,
    lastActivity: "1 day ago",
    initials: "RC",
    status: "active",
  },
  {
    id: "4",
    name: "Aerospace Industries Assoc.",
    organization: "Defense & Aerospace Industry Group",
    topics: 12,
    lastActivity: "2 days ago",
    initials: "AI",
    status: "active",
  },
  {
    id: "5",
    name: "Patient First Alliance",
    organization: "Healthcare Advocacy Organization",
    topics: 6,
    lastActivity: "3 days ago",
    initials: "PF",
    status: "active",
  },
  {
    id: "6",
    name: "National Education Council",
    organization: "Education Policy Think Tank",
    topics: 4,
    lastActivity: "1 week ago",
    initials: "NE",
    status: "inactive",
  },
];

export default function ClientsPage() {
  const [search, setSearch] = React.useState("");

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.organization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="mt-1 text-sm text-cool-grey">
            Manage your client portfolio and track their legislative interests.
          </p>
        </div>
        <Button variant="accent" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cool-grey" />
        <Input
          placeholder="Search clients by name or organization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Client List */}
      {filtered.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filtered.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors duration-150 hover:bg-gray-50 cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs">
                      {client.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {client.name}
                    </p>
                    <p className="text-xs text-cool-grey">
                      {client.organization}
                    </p>
                  </div>
                  <div className="hidden items-center gap-6 sm:flex">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {client.topics}
                      </p>
                      <p className="text-xs text-cool-grey">topics</p>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="text-xs text-cool-grey">
                        {client.lastActivity}
                      </p>
                    </div>
                    <Badge
                      variant={
                        client.status === "active" ? "success" : "secondary"
                      }
                    >
                      {client.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Users className="h-7 w-7 text-cool-grey" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            No clients found
          </h3>
          <p className="mt-1 text-sm text-cool-grey">
            Try adjusting your search or add a new client.
          </p>
          <Button variant="accent" className="mt-4 gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      )}
    </PageShell>
  );
}
