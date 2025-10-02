import { cn } from "@/util";
import React from "react";

export function MenuOption({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={cn(
        "appearance-none flex flex-row items-center gap-1 bg-slate-500 hover:bg-slate-600 transition-colors px-2 py-1 text-xs cursor-pointer border-r border-r-slate-400 last:border-r-0",
        className
      )}
    />
  );
}
