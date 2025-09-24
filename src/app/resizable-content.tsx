"use client";
import { useElement, useItem } from "@/context";
import { useMouseMovementOnPaper } from "@/hooks/use-mouse-movement-on-paper";
import React from "react";

interface ResizableContentProps {
  children?: React.ReactNode;
}
function ResizableContent({ children }: ResizableContentProps) {
  const [resize, setResize] = React.useState<
    "NO" | "SO" | "NE" | "SE" | undefined
  >();
  const { setIsPressed, isPressed, setStates, states, setIsResizing, element } =
    useItem();
  const parentMousePosition = useMouseMovementOnPaper();
  const { selectedElement } = useElement();

  React.useEffect(() => {
    function handleResize() {
      if (!isPressed) {
        return;
      }
      if (resize === "SE") {
        setStates((prev) => ({
          ...prev,
          size: {
            ...prev.size,
            width: parentMousePosition.x - states.position.x,
            height: parentMousePosition.y - states.position.y,
          },
        }));
      }
    }

    function handleMouseMovement() {
      handleResize();
    }

    window.addEventListener("mousemove", handleMouseMovement);

    return () => {
      window.removeEventListener("mousemove", handleMouseMovement);
    };
  }, [resize, parentMousePosition, states.position, isPressed, setStates]);

  React.useEffect(() => {
    const handleMouseUp = () => {
      setIsPressed(false);
      setIsResizing(false);
      setResize(undefined);

      const cursor = document.body.classList
        .values()
        .find((c) => c.startsWith("cursor"));
      if (cursor) {
        document.body.classList.remove(cursor);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setIsPressed, setIsResizing]);

  function onResizeClickedIn(evt: React.MouseEvent<HTMLDivElement>) {
    const cursor = evt.currentTarget.classList
      .values()
      .find((c) => c.startsWith("cursor"));

    if (cursor) {
      document.body.classList.add(cursor);
    }

    setIsPressed(true);
    setIsResizing(true);
  }

  if (!selectedElement || selectedElement.id !== element.id) {
    return children;
  }

  return (
    <div
      className="absolute top-0 left-0 z-10"
      style={{
        transform: `translate(${states.position.x}px, ${
          states.position.y - 1
        }px)`,
        width: states.size.width,
        height: states.size.height,
      }}
    >
      <div
        className="border-1 border-blue-300 relative"
        // style={{
        //   width: `${states.size.width}px`,
        //   height: `${states.size.height}px`,
        // }}
      >
        <div
          className="size-2 bg-gray-400 absolute top-0 left-0 -translate-1/2 cursor-nwse-resize"
          onMouseEnter={() => {
            setResize("NO");
          }}
          onMouseDown={onResizeClickedIn}
        ></div>
        <div
          onMouseEnter={() => {
            setResize("NE");
          }}
          className="size-2 bg-gray-400 absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize"
        ></div>
        <div
          onMouseEnter={() => {
            setResize("SO");
          }}
          className="size-2 bg-gray-400 absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 cursor-nesw-resize"
        ></div>
        <div
          onMouseEnter={() => {
            setResize("SE");
          }}
          onMouseDown={onResizeClickedIn}
          className="size-2 bg-gray-400 absolute bottom-0 right-0 translate-1/2 cursor-nwse-resize"
        ></div>
        <div
          style={{
            width: `${states.size.width}px`,
            height: `${states.size.height}px`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default ResizableContent;
