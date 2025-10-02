import { cn } from "@/util";
import React from "react";

export function MenuRoot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-row bg-slate-500 border-b", className)}
      {...props}
    />
  );
}
