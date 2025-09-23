"use client";
import { useMouseMovementOnPaper as useMouseMovementOnPaper } from "@/hooks/use-mouse-movement-on-paper";
import React from "react";

function DraggableContent({ children }: { children?: React.ReactNode }) {
  const parentMousePosition = useMouseMovementOnPaper();
  const [position, setPosition] = React.useState({
    x: 0,
    y: 0,
  });

  const [states, setStates] = React.useState<{
    clickedAt: {
      x: number;
      y: number;
    };
    size: {
      width: number;
      height: number;
    };
  }>({ clickedAt: { x: 0, y: 0 }, size: { width: 80, height: 80 } });

  function setClickedAt(clickedAt: { x: number; y: number }) {
    setStates((prev) => ({ ...prev, clickedAt }));
  }

  const [isPressedButton, setIsPressedButton] = React.useState(false);
  const [resize, setResize] = React.useState<
    "NO" | "SO" | "NE" | "SE" | undefined
  >();

  React.useEffect(() => {
    const handleMouseUp = () => {
      setIsPressedButton(false);
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
  }, []);

  React.useEffect(() => {
    const { clickedAt } = states;
    if (isPressedButton && !resize) {
      setPosition({
        x: parentMousePosition.x - clickedAt.x,
        y: parentMousePosition.y - clickedAt.y,
      });
    }
  }, [isPressedButton, resize, parentMousePosition, states]);

  // console.log(isPressedButton, resize);

  React.useEffect(() => {
    function handleResize() {
      if (!isPressedButton) {
        return;
      }
      if (resize === "SE") {
        setStates((prev) => ({
          ...prev,
          size: {
            ...prev.size,
            width: parentMousePosition.x - position.x - 16,
            height: parentMousePosition.y - position.y - 16,
          },
        }));
      }
    }
    window.addEventListener("mousemove", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleResize);
    };
  }, [resize, parentMousePosition, position, isPressedButton]);

  function onResizeClickedIn(evt: React.MouseEvent<HTMLDivElement>) {
    const cursor = evt.currentTarget.classList
      .values()
      .find((c) => c.startsWith("cursor"));

    if (cursor) {
      document.body.classList.add(cursor);
    }

    setIsPressedButton(true);
  }

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
    >
      <div className="border-1 border-blue-300 p-2 relative">
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

export default DraggableContent;
