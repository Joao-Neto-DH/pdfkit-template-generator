import { CanvasElement, ItemProvider } from "@/context";
import React from "react";

function Item({
  children,
  element,
}: {
  children: React.ReactNode;
  element: CanvasElement;
}) {
  // const { inspectedElement } = useInspector();
  // console.log(element);

  return <ItemProvider element={element}>{children}</ItemProvider>;
}

export default Item;
