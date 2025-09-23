"use client";
import React from "react";
import DraggableContent from "./draggable-content";
import { Ruler, RulerMousePosition } from "@/components/domain";
import { useElement } from "@/context";
import Item from "./item";
import ResizableContent from "./resizable-content";

const ONE_CENTIMETER_IN_POINT = 28.346;

export default function Home() {
  const [pageViewport, setPageViewport] = React.useState({
    width: 0,
    height: 0,
  });
  const { elements, addElement } = useElement();

  React.useEffect(() => {
    const handleResize = () => {
      const screen = document.getElementById("screen")!;
      const width = screen.getBoundingClientRect().width;

      setPageViewport({
        width: width,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div id="screen" className="w-screen h-screen flex flex-col bg-gray-400">
      <div className="flex flew-row w-full overflow-hidden border relative">
        <Ruler
          base_distance_between_units={ONE_CENTIMETER_IN_POINT}
          rule_size={Math.ceil(
            pageViewport.width / ONE_CENTIMETER_IN_POINT / 1.4
          )}
        >
          <RulerMousePosition />
        </Ruler>
      </div>
      <div className="h-full overflow-auto">
        <div className="h-full flex flex-row">
          <div className="h-full">
            <div className="h-full overflow-hidden">
              <Ruler
                base_distance_between_units={ONE_CENTIMETER_IN_POINT}
                rule_size={Math.ceil(
                  pageViewport.width / ONE_CENTIMETER_IN_POINT / 1.4
                )}
                vertical
              >
                <RulerMousePosition vertical />
              </Ruler>
            </div>
          </div>
          <div id="canvas" className="h-full w-full p-6 overflow-auto">
            <div
              id="paper"
              className="w-[791.72px] h-[1119.71px] mx-auto relative overflow-hidden"
            >
              {elements.map((element) => (
                <Item element={element} key={element.id}>
                  <DraggableContent>
                    <ResizableContent>
                      <div className="bg-red-600 w-full h-full"></div>
                    </ResizableContent>
                  </DraggableContent>
                </Item>
              ))}

              <div className="bg-white w-full h-full mx-auto shadow-2xl"></div>
            </div>
          </div>
          <div className="w-96 h-full bg-white overflow-y-auto">
            <div className="p-4 space-y-3">
              <div className="">
                <p className="font-bold text-slate-600 uppercas">Elementos</p>
                <div className="">
                  <button
                    onClick={() => {
                      addElement({
                        height: 80,
                        width: 80,
                        x: 0,
                        y: 0,
                        id: Date.now(),
                        type: "square",
                      });
                    }}
                    className="bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer"
                  >
                    Quadrado
                  </button>
                </div>
              </div>
              <p className="font-bold text-slate-600 uppercas">Inpector</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
