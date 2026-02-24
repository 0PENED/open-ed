import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Settings, FolderOpen } from "lucide-react";
import type { CalendarData } from "@/lib/scheduleStore";

interface AdminCalendarManagerProps {
  calendars: CalendarData[];
  onAdd: (code: string, name: string) => void;
  onDelete: (code: string) => void;
  onSelect: (code: string) => void;
}

export function AdminCalendarManager({ calendars, onAdd, onDelete, onSelect }: AdminCalendarManagerProps) {
  const [open, setOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;
    if (calendars.some((c) => c.openCode.toLowerCase() === newCode.trim().toLowerCase())) {
      setError("This OPENCODE already exists");
      return;
    }
    onAdd(newCode.trim().toUpperCase(), newName.trim());
    setNewCode("");
    setNewName("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Manage Calendars</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="OPENCODE"
              value={newCode}
              onChange={(e) => { setNewCode(e.target.value); setError(""); }}
              className="uppercase tracking-wider"
            />
            <Input
              placeholder="Calendar name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Calendar
          </Button>
        </form>

        <div className="mt-4 space-y-2">
          {calendars.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No calendars yet</p>
          )}
          {calendars.map((cal) => (
            <div key={cal.openCode} className="flex items-center justify-between rounded-lg border bg-background p-3">
              <button onClick={() => { onSelect(cal.openCode); setOpen(false); }} className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
                <FolderOpen className="h-4 w-4 text-primary" />
                <div>
                  <span className="font-medium text-foreground">{cal.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground font-mono">{cal.openCode}</span>
                </div>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(cal.openCode)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
