"use client";

import { useDialog } from "@/components/domain/dialog";

export function Trigger({
  children,
  className,
  onClick,
  onBeforeClose,
  title,
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onBeforeClose?: () => false | void;
  title?: string;
}) {
  const { setOpen, open } = useDialog();
  return (
    <button
      title={title}
      onClick={(evt) => {
        const result = onBeforeClose?.();

        if (result === false) {
          return;
        }

        setOpen(!open);
        onClick?.(evt);
      }}
      className={className}
    >
      {children}
    </button>
  );
}
