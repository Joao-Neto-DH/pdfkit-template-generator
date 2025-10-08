"use client";
import Dialog from "@/components/domain/dialog";
import { Trigger } from "./trigger";
import React from "react";
import { CanvasElement, useElement } from "@/context";
import { generateId } from "@/util";
import { Table2 } from "lucide-react";

export function Table({
  cols = 2,
  rows = 2,
  element,
  onDone,
}: {
  cols?: number;
  rows?: number;
  element?: CanvasElement;
  onDone?: (element: CanvasElement) => void;
}) {
  const { addElement, elements } = useElement();
  const [tableDefinition, setTableDefinition] = React.useState({
    cols,
    rows,
  });

  const changeTableDefinition = (
    field: keyof typeof tableDefinition,
    value: number
  ) => {
    setTableDefinition((prevTableDefinition) => ({
      ...prevTableDefinition,
      [field]: value,
    }));
  };

  return (
    <Dialog
      dialogTrigger={
        <Trigger
          title={"Rectangulo"}
          className="flex flex-row items-center gap-1 bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer"
        >
          <Table2 size={16} />
        </Trigger>
      }
    >
      <form onSubmit={(e) => e.preventDefault()} className="p-4">
        <div className="space-y-4 text-slate-800">
          <p className="font-bold">Previsualizar tabela</p>
          <div className="h-50 mx-auto overflow-auto">
            <table className="w-full [&_td,&_th]:p-2 [&_td,&_th]:text-sm [&_td,&_th]:border [&_th]:text-left">
              <thead>
                <tr>
                  {[...Array(tableDefinition.cols)].map((_, index) => (
                    <th key={index}>Coluna {index + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(tableDefinition.rows)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(tableDefinition.cols)].map((_, colIndex) => (
                      <td key={colIndex}>
                        Data {rowIndex + 1}-{colIndex + 1}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex">
              <label className="mr-2">Colunas</label>
              <input
                type="number"
                className="border rounded"
                value={tableDefinition.cols}
                min={1}
                onChange={(e) =>
                  changeTableDefinition("cols", Number(e.target.value))
                }
              />
            </div>
            <div className="flex">
              <label className="mr-2">Linhas</label>
              <input
                type="number"
                className="border rounded"
                value={tableDefinition.rows}
                min={0}
                onChange={(e) =>
                  changeTableDefinition("rows", Number(e.target.value))
                }
              />
            </div>
          </div>
          <Trigger
            onBeforeClose={() => {
              if (element && element.type === "table") {
                onDone?.({
                  ...element,
                  ...tableDefinition,
                });
                return;
              }

              addElement({
                type: "table",
                height: 300,
                width: 300,
                x: 0,
                y: 0,
                id: generateId(elements.length),
                ...tableDefinition,
              });
            }}
            className="bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer w-full"
          >
            {element && element.type === "table" ? "Actualizar" : "Criar"}
          </Trigger>
        </div>
      </form>
    </Dialog>
  );
}
