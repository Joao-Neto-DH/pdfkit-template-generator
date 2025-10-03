"use client";
import React from "react";

type BaseElement = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type TextElement = BaseElement & {
  type: "text";
  content: string;
  option: {
    fontSize: number;
    align: "left" | "center" | "right" | "justify";
    color: string;
    style: number;
  };
};

type SquareElement = BaseElement & {
  type: "square";
  color: string;
};

type ImageElement = BaseElement & {
  type: "image";
  src: string;
};

export type CanvasElement = TextElement | SquareElement | ImageElement;

export interface ElementContextProps {
  elements: Array<CanvasElement>;
  addElement: (element: CanvasElement) => void;
  removeElement: (id: number) => void;
  updateElement: (element: CanvasElement) => void;
  selectedElement: CanvasElement | null;
  setSelectedElement: React.Dispatch<
    React.SetStateAction<CanvasElement | null>
  >;
  changeElementOrder: (fromIndex: number, toIndex: number) => void;
  setElements: (elements: Array<CanvasElement>) => void;
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
        changeElementOrder(fromIndex, toIndex) {
          setElements((prev) => {
            const toElement = prev[toIndex];
            prev[toIndex] = prev[fromIndex];
            prev[fromIndex] = toElement;
            return [...prev];
          });
        },
        setElements,
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
