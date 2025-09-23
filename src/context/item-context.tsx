"use client";
import React from "react";

interface ItemContextProps {
  isPressed: boolean;
  setIsPressed: React.Dispatch<React.SetStateAction<boolean>>;
  isResizing: boolean;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
  states: State;
  setStates: React.Dispatch<React.SetStateAction<State>>;
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
  startPosition: { x: number; y: number };
  startSize: { width: number; height: number };
}) {
  const [isPressed, setIsPressed] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [states, setStates] = React.useState<State>({
    clickedAt: props.startPosition,
    size: props.startSize,
    position: props.startPosition,
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
