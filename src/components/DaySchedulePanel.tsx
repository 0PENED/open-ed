import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Clock, X } from "lucide-react";
import type { Schedule } from "@/lib/scheduleStore";
import { format, parseISO } from "date-fns";

interface DaySchedulePanelProps {
  date: string;
  schedules: Schedule[];
  isAdmin: boolean;
  onAdd: (schedule: { title: string; description: string; time?: string }) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function DaySchedulePanel({ date, schedules, isAdmin, onAdd, onDelete, onClose }: DaySchedulePanelProps) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), time: time || undefined });
    setTitle("");
    setDescription("");
    setTime("");
    setAdding(false);
  };

  const formattedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");

  return (
    <div className="rounded-xl border bg-card p-4 md:p-6 shadow-sm animate-scale-in">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-card-foreground">{formattedDate}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {schedules.length === 0 && !adding && (
        <p className="py-8 text-center text-muted-foreground">No schedules for this day</p>
      )}

      <div className="space-y-3">
        {schedules.map((s) => (
          <div key={s.id} className="flex items-start gap-3 rounded-lg border bg-background p-3 animate-fade-in">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{s.title}</span>
                {s.time && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {s.time}
                  </span>
                )}
              </div>
              {s.description && (
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              )}
            </div>
            {isAdmin && (
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => onDelete(s.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && !adding && (
        <Button variant="outline" className="mt-4 w-full gap-2" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" />
          Add Schedule
        </Button>
      )}

      {isAdmin && adding && (
        <form onSubmit={handleAdd} className="mt-4 space-y-3 rounded-lg border bg-background p-4 animate-scale-in">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="flex gap-2">
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-36" />
          </div>
          <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <div className="flex gap-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}
