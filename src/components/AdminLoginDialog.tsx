import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, LogOut } from "lucide-react";

interface AdminLoginDialogProps {
  isAdmin: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
}

export function AdminLoginDialog({ isAdmin, onLogin, onLogout }: AdminLoginDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setOpen(false);
      setPassword("");
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isAdmin) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Lock className="h-4 w-4" />
          Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Admin Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="mt-1 text-sm text-destructive">Incorrect password</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
