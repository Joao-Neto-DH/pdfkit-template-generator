"use client";
import React from "react";

export interface CanvasElement {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ElementContextProps {
  elements: Array<CanvasElement>;
  addElement: (element: CanvasElement) => void;
  removeElement: (id: number) => void;
  updateElement: (element: CanvasElement) => void;
  selectedElement: CanvasElement | null;
  setSelectedElement: React.Dispatch<
    React.SetStateAction<CanvasElement | null>
  >;
}

export const ElementContext = React.createContext<ElementContextProps>(null!);

export function ElementProvider(props: { children: React.ReactNode }) {
  const [elements, setElements] = React.useState<Array<CanvasElement>>([]);
  const [selectedElement, setSelectedElement] =
    React.useState<CanvasElement | null>(null);

  function addElement(element: CanvasElement) {
    setElements((prev) => [...prev, element]);
  }
  function removeElement(id: number) {
    setElements((prev) => prev.filter((element) => element.id !== id));
  }
  function updateElement(element: CanvasElement) {
    setElements((prev) => prev.map((e) => (e.id === element.id ? element : e)));
  }

  return (
    <ElementContext.Provider
      value={{
        elements,
        addElement,
        removeElement,
        updateElement,
        selectedElement,
        setSelectedElement,
      }}
    >
      {props.children}
    </ElementContext.Provider>
  );
}

export function useElement() {
  const elementContext = React.useContext(ElementContext);
  if (!elementContext) {
    throw new Error("useElement must be used within a ElementProvider");
  }
  return elementContext;
}
