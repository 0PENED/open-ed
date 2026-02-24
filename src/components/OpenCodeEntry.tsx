import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, ArrowRight } from "lucide-react";

interface OpenCodeEntryProps {
  onSubmit: (code: string) => void;
  error?: string;
}

export function OpenCodeEntry({ onSubmit, error }: OpenCodeEntryProps) {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) onSubmit(code.trim());
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
            Enter your OPENCODE to access a calendar
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
      </div>
    </div>
  );
}
