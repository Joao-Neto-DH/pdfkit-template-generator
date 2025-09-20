"use client";
import React from "react";

interface IPaper {
  mousePositionInCanvas: { x: number; y: number };
  setMousePositionInCanvas: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  viewPointScrollValue: { x: number; y: number };
  setViewPointScrollValue: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}

export const PaperContext = React.createContext<IPaper>(undefined!);

export function usePaper() {
  const paperContext = React.useContext(PaperContext);
  if (!paperContext) {
    throw new Error("usePaper must be used within a PaperProvider");
  }
  return paperContext;
}

export function PaperProvider({ children }: { children: React.ReactNode }) {
  const [mousePositionInCanvas, setMousePositionInCanvas] = React.useState({
    x: 0,
    y: 0,
  });
  const [viewPointScrollValue, setViewPointScrollValue] = React.useState({
    x: 0,
    y: 0,
  });

  return (
    <PaperContext.Provider
      value={{
        mousePositionInCanvas,
        setMousePositionInCanvas,
        setViewPointScrollValue,
        viewPointScrollValue,
      }}
    >
      {children}
    </PaperContext.Provider>
  );
}
