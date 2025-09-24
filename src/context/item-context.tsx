"use client";
import React from "react";
import { CanvasElement } from "./element-context";

interface ItemContextProps {
  isPressed: boolean;
  setIsPressed: React.Dispatch<React.SetStateAction<boolean>>;
  isResizing: boolean;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
  states: State;
  setStates: React.Dispatch<React.SetStateAction<State>>;
  element: CanvasElement;
}

type State = {
  clickedAt: {
    x: number;
    y: number;
  };
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
};

export const ItemContext = React.createContext<ItemContextProps>(null!);

export function ItemProvider(props: {
  children: React.ReactNode;
  element: CanvasElement;
}) {
  const [isPressed, setIsPressed] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [states, setStates] = React.useState<State>({
    clickedAt: { x: props.element.x, y: props.element.y },
    size: { width: props.element.width, height: props.element.height },
    position: { x: props.element.x, y: props.element.y },
  });

  return (
    <ItemContext.Provider
      value={{
        isPressed,
        setIsPressed,
        isResizing,
        setIsResizing,
        states,
        setStates,
        element: props.element,
      }}
    >
      {props.children}
    </ItemContext.Provider>
  );
}

export function useItem() {
  const itemContext = React.useContext(ItemContext);
  if (!itemContext) {
    throw new Error("useItem must be used within a ItemProvider");
  }
  return itemContext;
}
