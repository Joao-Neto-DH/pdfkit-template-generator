"use client";
import { useElement, useInspector, useItem } from "@/context";
import { useMouseMovementOnPaper as useMouseMovementOnPaper } from "@/hooks/use-mouse-movement-on-paper";
import React from "react";

interface DraggableContentProps {
  children?: React.ReactNode;
  className?: string;
  offset?: number;
}

function DraggableContent({
  children,
  className,
  offset = 0,
}: DraggableContentProps) {
  const parentMousePosition = useMouseMovementOnPaper();
  const { isResizing, setIsPressed, isPressed, states, setStates, element } =
    useItem();
  const { setSelectedElement, updateElement } = useElement();
  const { setInspectedElement, inspectedElement, onInspectedElementChange } =
    useInspector();

  function setClickedAt(clickedAt: { x: number; y: number }) {
    setStates((prev) => ({ ...prev, clickedAt }));
  }

  React.useEffect(() => {
    const handleMouseUp = () => {
      setIsPressed(false);
      if (inspectedElement?.id === element.id) {
        updateElement({
          ...element,
          x: states.position.x,
          y: states.position.y,
          width: states.size.width,
          height: states.size.height,
        });
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setIsPressed, updateElement, element, states, inspectedElement]);

  React.useEffect(() => {
    if (isPressed && !isResizing) {
      const x = parentMousePosition.x - states.clickedAt.x;
      const y = parentMousePosition.y - states.clickedAt.y;

      if (states.position.x === x && states.position.y === y) {
        return;
      }

      setStates((prev) => ({
        ...prev,
        position: {
          x,
          y,
        },
      }));
    }
  }, [
    isPressed,
    isResizing,
    parentMousePosition,
    setStates,
    states.clickedAt,
    states.position,
  ]);

  React.useEffect(() => {
    onInspectedElementChange({
      x: states.position.x,
      y: states.position.y,
      id: element.id,
    });
  }, [onInspectedElementChange, element.id, states.position]);

  return (
    <div
      className={`absolute top-0 left-0 ${className}`.trim()}
      style={{
        transform: `translate(${states.position.x}px, ${
          states.position.y - offset
        }px)`,
        width: states.size.width,
        height: states.size.height,
      }}
      onClick={(evt) => {
        evt.stopPropagation();
        setSelectedElement(element);
        setInspectedElement(element);
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
