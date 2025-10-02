"use client";
import React from "react";
import { createPortal } from "react-dom";

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>(null!);

function Dialog({
  children,
  dialogTrigger,
}: {
  children: React.ReactNode;
  dialogTrigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {dialogTrigger}
      {open &&
        createPortal(
          <div className="bg-slate-700/40 fixed inset-0">
            <div className=" overflow-auto bg-white fixed top-1/2 left-1/2 -translate-1/2 max-w-[50vw] max-h-[80vh] rounded shadow-2xl z-20">
              <div className="relative">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-2 p-1 bg-amber-400 text-xs rounded"
                >
                  Fechar
                </button>
                {children}
              </div>
            </div>
          </div>,
          document.body
        )}
    </DialogContext.Provider>
  );
}

export const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export default Dialog;
