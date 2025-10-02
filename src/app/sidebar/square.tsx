"use client";
import Dialog from "@/components/domain/dialog";
import { Trigger } from "./trigger";
import React from "react";
import { useElement } from "@/context";
import { generateId } from "@/util";

export function Square() {
  const { addElement, elements } = useElement();
  const [size, setSize] = React.useState({ width: 100, height: 100 });
  const [color, setColor] = React.useState("#000000");

  return (
    <Dialog
      dialogTrigger={
        <Trigger className="w-full bg-blue-400 hover:bg-blue-500 transition-colors px-2 py-1 rounded cursor-pointer">
          Rectangulo
        </Trigger>
      }
    >
      <form onSubmit={(e) => e.preventDefault()} className="p-4">
        <div className="space-y-4 text-slate-800">
          <p className="font-bold">Previsualizar rectangulo</p>
          <div
            className="w-50 h-50 mx-auto"
            style={{
              backgroundColor: color,
            }}
          ></div>
          <div className="grid grid-cols-2 px-4">
            <div className="flex">
              <label className="mr-2">L</label>
              <input
                type="number"
                className="border rounded"
                value={size.width}
                onChange={(e) =>
                  setSize({ ...size, width: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex">
              <label className="mr-2">H</label>
              <input
                type="number"
                className="border rounded"
                value={size.height}
                onChange={(e) =>
                  setSize({ ...size, height: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="flex">
            <label className="mr-2">Cor</label>
            <input
              type="color"
              defaultValue={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <Trigger
            onBeforeClose={() => {
              addElement({
                type: "square",
                color,
                height: size.height,
                width: size.width,
                x: 0,
                y: 0,
                id: generateId(elements.length),
              });
            }}
            className="bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer w-full"
          >
            Criar
          </Trigger>
        </div>
      </form>
    </Dialog>
  );
}
