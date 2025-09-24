"use client";
import { useElement, useItem } from "@/context";
import { useMouseMovementOnPaper as useMouseMovementOnPaper } from "@/hooks/use-mouse-movement-on-paper";
import React from "react";

interface DraggableContentProps {
  children?: React.ReactNode;
}

function DraggableContent({ children }: DraggableContentProps) {
  const parentMousePosition = useMouseMovementOnPaper();
  const { isResizing, setIsPressed, isPressed, states, setStates, element } =
    useItem();
  const { setSelectedElement } = useElement();

  function setClickedAt(clickedAt: { x: number; y: number }) {
    setStates((prev) => ({ ...prev, clickedAt }));
  }

  React.useEffect(() => {
    const handleMouseUp = () => {
      setIsPressed(false);
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setIsPressed]);

  React.useEffect(() => {
    if (isPressed && !isResizing) {
      setStates((prev) => ({
        ...prev,
        position: {
          x: parentMousePosition.x - states.clickedAt.x,
          y: parentMousePosition.y - states.clickedAt.y,
        },
      }));
    }
  }, [isPressed, isResizing, parentMousePosition, setStates, states.clickedAt]);

  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translate(${states.position.x}px, ${states.position.y}px)`,
        width: states.size.width,
        height: states.size.height,
      }}
      onClick={(evt) => {
        evt.stopPropagation();
        setSelectedElement(element);
      }}
      onMouseDown={(evt) => {
        const rect = evt.currentTarget.getBoundingClientRect();
        const relativeX = Math.abs(rect.x - evt.clientX);
        const relativeY = Math.abs(rect.y - evt.clientY);
        setClickedAt({
          x: relativeX,
          y: relativeY,
        });
        setIsPressed(true);
      }}
    >
      {children}
    </div>
  );
}

export default DraggableContent;
