import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, ArrowRight, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OpenCodeEntryProps {
  onSubmit: (code: string) => void;
  onCreate: (code: string, name: string, password: string) => boolean;
  error?: string;
}

export function OpenCodeEntry({ onSubmit, onCreate, error }: OpenCodeEntryProps) {
  const [code, setCode] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [createError, setCreateError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) onSubmit(code.trim());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim() || !newPassword.trim()) {
      setCreateError("All fields are required");
      return;
    }
    if (newPassword.trim().length < 4) {
      setCreateError("Password must be at least 4 characters");
      return;
    }
    const success = onCreate(newCode.trim().toUpperCase(), newName.trim(), newPassword.trim());
    if (success) {
      setCreateOpen(false);
      setNewCode("");
      setNewName("");
      setNewPassword("");
      setCreateError("");
    } else {
      setCreateError("This OPENCODE already exists");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md animate-fade-in px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <CalendarDays className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-foreground">
            OPENED
          </h1>
          <p className="text-muted-foreground">
            Enter your OPENCODE to view a calendar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter OPENCODE"
            className="h-12 text-center text-lg font-medium tracking-widest uppercase"
          />
          {error && (
            <p className="text-center text-sm text-destructive animate-fade-in">{error}</p>
          )}
          <Button type="submit" className="w-full h-12 gap-2 text-base">
            Open Calendar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Calendar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle className="font-display">Create Calendar</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  placeholder="OPENCODE"
                  value={newCode}
                  onChange={(e) => { setNewCode(e.target.value); setCreateError(""); }}
                  className="uppercase tracking-wider"
                />
                <Input
                  placeholder="Calendar name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Set a password (for editing)"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setCreateError(""); }}
                />
                {createError && <p className="text-sm text-destructive">{createError}</p>}
                <Button type="submit" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Create Calendar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
