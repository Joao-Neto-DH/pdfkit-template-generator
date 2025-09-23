"use client";
import React from "react";

interface IPaper {
  // mousePositionInCanvas: { x: number; y: number };
  // setMousePositionInCanvas: React.Dispatch<
  //   React.SetStateAction<{ x: number; y: number }>
  // >;
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
  // const [mousePositionInCanvas, setMousePositionInCanvas] = React.useState({
  //   x: 0,
  //   y: 0,
  // });
  const [viewPointScrollValue, setViewPointScrollValue] = React.useState({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    const canvas = document.getElementById("canvas")!;

    const handleCanvasScroll = () => {
      setViewPointScrollValue((prev) => ({
        ...prev,
        y: canvas.scrollTop,
        x: canvas.scrollLeft,
      }));
    };

    canvas.addEventListener("scroll", handleCanvasScroll);
    return () => {
      canvas.removeEventListener("scroll", handleCanvasScroll);
    };
  }, []);

  // React.useEffect(() => {
  //   function canvasMouseMove(evt: MouseEvent) {
  //     if (
  //       "currentTarget" in evt &&
  //       evt.currentTarget &&
  //       evt.currentTarget instanceof HTMLDivElement
  //     ) {
  //       const rect = evt.currentTarget.getBoundingClientRect();
  //       const relativeX = Math.abs(rect.x - evt.clientX);
  //       const relativeY = Math.abs(rect.y - evt.clientY);
  //       setMousePositionInCanvas(() => ({
  //         x: relativeX,
  //         y: relativeY,
  //       }));
  //     }
  //   }

  //   const paper = document.getElementById("paper")! as HTMLDivElement;
  //   paper.addEventListener("mousemove", canvasMouseMove);

  //   return () => {
  //     paper.removeEventListener("mousemove", canvasMouseMove);
  //   };
  // }, []);

  return (
    <PaperContext.Provider
      value={{
        // mousePositionInCanvas,
        // setMousePositionInCanvas,
        setViewPointScrollValue,
        viewPointScrollValue,
      }}
    >
      {children}
    </PaperContext.Provider>
  );
}
