"use client";
import React from "react";
import { CanvasElement, ElementContext } from "./element-context";
import { debounce } from "lodash";

interface InspectorContextProps {
  inspectedElement: CanvasElement | null;
  setInspectedElement: (element: CanvasElement | null) => void;
  onInspectedElementChange: (element: Partial<CanvasElement>) => void;
}

export const InspectorContext = React.createContext<InspectorContextProps>(
  null!
);

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [inspectedElement, setInspectedElement] =
    React.useState<CanvasElement | null>(null);
  const { updateElement } = React.use(ElementContext);

  const onInspectedElementChangeWithDebounce = debounce(
    (element: Partial<CanvasElement>) => {
      // @ts-expect-error will always be the same type
      setInspectedElement((prev) => {
        if (prev) {
          return { ...prev, ...element, id: prev.id };
        }
        return prev;
      });

      if (inspectedElement) {
        // @ts-expect-error will always be the same type
        updateElement({ ...inspectedElement, ...element });
      }
    },
    500
  );

  return (
    <InspectorContext.Provider
      value={{
        inspectedElement,
        setInspectedElement(element) {
          setInspectedElement(() => {
            if (element) {
              return { ...element };
            }
            return null;
          });
        },
        onInspectedElementChange: (element) => {
          let thereIsChange = false;

          if (inspectedElement?.id !== element.id) {
            return;
          }
          //   console.log("INSPECTOR", element);

          for (const key in element) {
            const tempKey = key as keyof CanvasElement;

            if (element[tempKey] !== inspectedElement?.[tempKey]) {
              thereIsChange = true;
              break;
            }
          }
          if (thereIsChange) {
            onInspectedElementChangeWithDebounce(element);
          }
        },
      }}
    >
      {children}
    </InspectorContext.Provider>
  );
}

export function useInspector() {
  const inspectorContext = React.useContext(InspectorContext);
  if (!inspectorContext) {
    throw new Error("useInspector must be used within a InspectorProvider");
  }
  return inspectorContext;
}
