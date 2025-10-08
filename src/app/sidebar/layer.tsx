"use client";

import { CanvasElement, useElement, useInspector } from "@/context";
import { cn } from "@/util";
import { ImageIcon, SquareIcon, Type, Table2 } from "lucide-react";
import React from "react";

export function Layer({
  element,
  index,
}: {
  element: CanvasElement;
  index: number;
}) {
  const { inspectedElement, setInspectedElement } = useInspector();
  const { changeElementOrder } = useElement();
  const [dragOver, setDragOver] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  return (
    <div
      key={element.id}
      draggable
      className={cn(
        "flex flex-row items-center gap-2 cursor-pointer p-2",
        element.id === inspectedElement?.id && "bg-blue-100",
        dragOver && "outline-2 outline-red-400",
        dragging && "opacity-50"
      )}
      onDragStart={(e) => {
        e.dataTransfer.clearData("text");
        e.dataTransfer.setData("text", index.toString());
        setDragging(true);
        setDragOver(false);
      }}
      onDragEnd={() => setDragging(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        const id = Number(e.dataTransfer.getData("text"));

        changeElementOrder(id, index);

        setDragOver(false);
        setDragging(false);
        e.dataTransfer.clearData("text");
      }}
      onClick={() => setInspectedElement(element)}
    >
      {element.type === "text" && (
        <Type size={16} className="stroke-amber-600" />
      )}
      {element.type === "square" && (
        <SquareIcon size={16} className="stroke-amber-600" />
      )}
      {element.type === "image" && (
        <ImageIcon size={16} className="stroke-amber-600" />
      )}
      {element.type === "table" && (
        <Table2 size={16} className="stroke-amber-600" />
      )}
      <span className="text-slate-600 text-sm">
        {element.type}-{element.id}
      </span>
    </div>
  );
}
