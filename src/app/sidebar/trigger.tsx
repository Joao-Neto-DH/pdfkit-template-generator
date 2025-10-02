"use client";

import { useDialog } from "@/components/domain/dialog";

export function Trigger({
  children,
  className,
  onClick,
  onBeforeClose,
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onBeforeClose?: () => void;
}) {
  const { setOpen, open } = useDialog();
  return (
    <button
      onClick={(evt) => {
        onBeforeClose?.();
        setOpen(!open);
        onClick?.(evt);
      }}
      className={className}
    >
      {children}
    </button>
  );
}
