"use client";
import { useElement, useInspector } from "@/context";
import React from "react";
import { Text, TextDialog } from "./text";
import { Square } from "./square";
import { ImageElement } from "./image";

export function Sidebar() {
  const { removeElement } = useElement();
  const { inspectedElement, onInspectedElementChange, setInspectedElement } =
    useInspector();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" && inspectedElement) {
        removeElement(inspectedElement.id);
        setInspectedElement(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inspectedElement, removeElement, setInspectedElement]);

  return (
    <div
      className="w-96 h-full bg-white overflow-y-auto"
      key={JSON.stringify(inspectedElement)}
    >
      <div className="p-4 space-y-3">
        <div className="">
          <p className="font-bold text-slate-600 text-sm uppercase">
            Elementos
          </p>
          <div className="flex flex-row flex-wrap gap-2">
            <Text />
            <Square />
            <ImageElement />
          </div>
        </div>
        <div className="text-sm">
          <p className="font-bold text-slate-600 text-sm uppercase">
            Propriedades
          </p>
          {inspectedElement && (
            <div className="space-y-1">
              <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                <label htmlFor="id">ID</label>
                <input type="text" value={inspectedElement.id} disabled />
              </div>
              <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                <label htmlFor="type">Tipo</label>
                <input type="text" value={inspectedElement.type} disabled />
              </div>
              <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                <label htmlFor="x">X</label>
                <input
                  type="text"
                  defaultValue={inspectedElement.x}
                  onChange={(evt) => {
                    const x = Number(evt.target.value);
                    onInspectedElementChange({
                      x,
                      id: inspectedElement.id,
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                <label htmlFor="y">Y</label>
                <input
                  type="text"
                  defaultValue={inspectedElement.y}
                  onChange={(evt) => {
                    const y = Number(evt.target.value);
                    onInspectedElementChange({
                      y,
                      id: inspectedElement.id,
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                <label htmlFor="width">Largura</label>
                <input
                  type="number"
                  defaultValue={inspectedElement.width}
                  onChange={(evt) => {
                    const width = Number(evt.target.value);
                    onInspectedElementChange({
                      width,
                      id: inspectedElement.id,
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                <label htmlFor="width">Altura</label>
                <input
                  type="text"
                  defaultValue={inspectedElement.height}
                  onChange={(evt) => {
                    const height = Number(evt.target.value);
                    onInspectedElementChange({
                      height,
                      id: inspectedElement.id,
                    });
                  }}
                />
              </div>
              {inspectedElement.type === "square" && (
                <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                  <label htmlFor="width">Cor</label>
                  <input
                    type="color"
                    defaultValue={inspectedElement.color}
                    onChange={(evt) => {
                      const color = evt.target.value;
                      onInspectedElementChange({
                        color,
                        id: inspectedElement.id,
                      });
                    }}
                  />
                </div>
              )}
              {inspectedElement.type === "image" && (
                <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                  <label htmlFor="width">Imagem</label>
                  <input
                    type="file"
                    onChange={(evt) => {
                      const src = URL.createObjectURL(evt.target.files![0]);
                      onInspectedElementChange({
                        src,
                        id: inspectedElement.id,
                      });
                    }}
                  />
                </div>
              )}
              {inspectedElement.type === "text" && (
                <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                  <div className="col-span-2 text-white pb-1">
                    <TextDialog
                      key={inspectedElement.id}
                      {...{
                        ...inspectedElement.option,
                        content: inspectedElement.content,
                      }}
                      onDone={(data) => {
                        onInspectedElementChange({
                          id: inspectedElement.id,
                          content: data.content,
                          option: {
                            align: data.align,
                            color: data.color,
                            fontSize: data.fontSize,
                            style: data.style,
                          },
                        });
                      }}
                      buttonText="Salvar"
                      triggerText="Editar texto"
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 items-center text-slate-600 border-b last:border-b-0">
                <button
                  onClick={() => {
                    removeElement(inspectedElement.id);
                    setInspectedElement(null);
                  }}
                  className="bg-red-400 hover:bg-red-500 text-white transition-colors p-1 rounded cursor-pointer col-span-2 block"
                >
                  Remover
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
