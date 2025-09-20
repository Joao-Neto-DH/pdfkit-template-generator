"use client";
import { usePaper } from "@/context";
import React from "react";

function DraggableContent({ children }: { children?: React.ReactNode }) {
  const { mousePositionInCanvas: parentMousePosition } = usePaper();
  const [position, setPosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [clickedAt, setClickedAt] = React.useState({
    x: 0,
    y: 0,
  });
  const [isPressedButton, setIsPressedButton] = React.useState(false);

  React.useEffect(() => {
    const handleMouseUp = () => {
      setIsPressedButton(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPressedButton]);

  React.useEffect(() => {
    if (isPressedButton) {
      setPosition({
        x: parentMousePosition.x - clickedAt.x,
        y: parentMousePosition.y - clickedAt.y,
      });
    }
  }, [isPressedButton, parentMousePosition, clickedAt]);

  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={(evt) => {
        const rect = evt.currentTarget.getBoundingClientRect();
        const relativeX = Math.abs(rect.x - evt.clientX);
        const relativeY = Math.abs(rect.y - evt.clientY);
        setClickedAt({
          x: relativeX,
          y: relativeY,
        });
        setIsPressedButton(true);
      }}
      // onMouseMove={(evt) => {
      //   if (isPressedButton) {
      //     const rect = evt.currentTarget.getBoundingClientRect();
      //     const relativeX = Math.abs(rect.x - clickedAt.x);
      //     const relativeY = Math.abs(rect.y - clickedAt.y);
      //     setPositions({
      //       x: evt.pageX - relativeX,
      //       y: evt.pageY - relativeY,
      //     });
      //   }
      // }}
    >
      {children}
    </div>
  );
}

export default DraggableContent;
