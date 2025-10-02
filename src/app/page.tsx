"use client";
import React from "react";
import DraggableContent from "./draggable-content";
import { Ruler, RulerMousePosition } from "@/components/domain";
import { useElement } from "@/context";
import Item from "./item";
import ResizableContent from "./resizable-content";
import { BOLD, ITALIC, Sidebar, UNDERLINE } from "./sidebar";

const ONE_CENTIMETER_IN_POINT = 28.346;

export default function Home() {
  const [pageViewport, setPageViewport] = React.useState({
    width: 0,
    height: 0,
  });
  const { elements, setSelectedElement } = useElement();

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
          <div
            id="canvas"
            className="h-full w-full p-6 space-y-4 overflow-auto"
          >
            <div
              id="paper"
              className="w-[791.72px] h-[1119.71px] mx-auto relative overflow-hidden isolate"
              onClick={() => setSelectedElement(null)}
            >
              {elements.map((element) => (
                <Item element={element} key={JSON.stringify(element)}>
                  <ResizableContent />
                  <DraggableContent>
                    {element.type === "text" && (
                      <pre
                        draggable={false}
                        className="w-full h-full overflow-visible whitespace-break-spaces select-none"
                        style={{
                          fontSize: `${element.option.fontSize}px`,
                          color: element.option.color,
                          textAlign: element.option.align,
                          textDecorationLine:
                            element.option.style & UNDERLINE
                              ? "underline"
                              : undefined,
                          fontWeight:
                            element.option.style & BOLD ? "bold" : undefined,
                          fontStyle:
                            element.option.style & ITALIC
                              ? "italic"
                              : undefined,
                        }}
                      >
                        {element.type === "text" && element.content}
                      </pre>
                    )}
                    {element.type === "square" && (
                      <div
                        className="w-full h-full select-none"
                        style={{
                          backgroundColor: element.color,
                        }}
                        draggable={false}
                      ></div>
                    )}
                    {element.type === "image" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={element.src}
                        className="w-full h-full select-none object-contain"
                        draggable={false}
                        alt={element.src}
                      />
                    )}
                  </DraggableContent>
                </Item>
              ))}

              <div className="bg-white w-full h-full mx-auto shadow-2xl"></div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
