"use client";

import { client } from "@realityware/rpc-backend";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userContext } from "../context";

const ALL_PERMISSIONS = ["member", "reviewer", "fulfillment", "admin"] as const;

export default function UserSettingsPage() {
  const { user, setUser } = useContext(userContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user.displayName);
  const [shards, setShards] = useState(user.shards);
  const [permissions, setPermissions] = useState<string[]>(
    user.permissions || [],
  );

  const handlePermissionChange = (perm: string, checked: boolean) => {
    if (checked) {
      setPermissions([...permissions, perm]);
    } else {
      setPermissions(permissions.filter((p) => p !== perm));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await client.admin.users[":id"].$patch({
        param: { id: user.id.toString() },
        json: {
          name,
          shards: Number(shards),
          permissions: permissions as any,
        },
      });

      const data = (await res.json()) as any;
      if (data.success) {
        toast.success("User settings updated successfully");
        setUser({
          ...user,
          ...data.user,
          project: user.project,
          logs: user.logs,
        });
        router.refresh();
      } else {
        toast.error("Failed to update user settings");
      }
    } catch (error) {
      toast.error("An error occurred while updating user settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Update the user's basic profile information and economy stats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shards">Shards</Label>
            <Input
              id="shards"
              type="number"
              value={shards}
              onChange={(e) => setShards(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="@container/settings">
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            Manage what this user is allowed to do within the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid @[380px]/settings:grid-cols-2 grid-cols-1 gap-4">
            {ALL_PERMISSIONS.map((perm) => (
              <div
                key={perm}
                className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  id={`perm-${perm}`}
                  checked={permissions.includes(perm)}
                  onCheckedChange={(checked) =>
                    handlePermissionChange(perm, checked === true)
                  }
                />
                <div className="flex flex-col gap-0.5">
                  <Label
                    htmlFor={`perm-${perm}`}
                    className="cursor-pointer font-medium text-sm capitalize leading-none"
                  >
                    {perm}
                  </Label>
                  <p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                    Role
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/30 px-6 py-4">
          <p className="text-muted-foreground text-xs">
            Changes will be applied immediately to the user session.
          </p>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
