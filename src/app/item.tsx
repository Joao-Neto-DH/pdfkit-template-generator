import { CanvasElement, ItemProvider } from "@/context";
import React from "react";

function Item({
  children,
  element,
}: {
  children: React.ReactNode;
  element: CanvasElement;
}) {
  return (
    <ItemProvider
      startPosition={{ x: element.x, y: element.y }}
      startSize={{ width: element.width, height: element.height }}
    >
      {children}
    </ItemProvider>
  );
}

export default Item;
