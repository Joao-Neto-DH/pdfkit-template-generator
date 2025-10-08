"use client";
import React from "react";
import DraggableContent from "./draggable-content";
import { Ruler, RulerMousePosition } from "@/components/domain";
import { CanvasElement, useElement } from "@/context";
import Item from "./item";
import ResizableContent from "./resizable-content";
import { Sidebar } from "./sidebar";
import { MenuOption, MenuRoot } from "@/components/domain/menu";
import { Save, Import } from "lucide-react";
import { pixelToPoint, pointToPixel, richTextToHtml } from "@/util";

const ONE_CENTIMETER_IN_POINT = 28.346;

export default function Home() {
  const [pageViewport, setPageViewport] = React.useState({
    width: 0,
    height: 0,
  });
  const { elements, setSelectedElement, setElements } = useElement();

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
      <MenuRoot>
        <MenuOption
          onClick={() => {
            const name = prompt("Qual o nome do arquivo?");

            const link = document.createElement("a");
            link.download = `${name || "untitled"}-${Date.now()}.json`;

            const parsedElements = elements.map((element) => ({
              ...element,
              width: pixelToPoint(element.width),
              height: pixelToPoint(element.height),
              x: pixelToPoint(element.x),
              y: pixelToPoint(element.y),
              option:
                element.type === "text"
                  ? {
                      ...element.option,
                      fontSize: pixelToPoint(element.option.fontSize),
                    }
                  : undefined,
            }));

            const blob = new Blob([JSON.stringify(parsedElements, null, 2)], {
              type: "text/json",
            });
            link.href = URL.createObjectURL(blob);
            link.click();
          }}
        >
          <Save size={16} />
          Exportar
        </MenuOption>
        <MenuOption
          onClick={() => {
            const file = document.createElement("input");
            file.type = "file";
            file.accept = ".json";

            file.onchange = async () => {
              const textContent = await file.files?.item(0)?.text();
              const jsonContent: CanvasElement[] = JSON.parse(textContent!);

              const parsedElements = jsonContent.map<CanvasElement>(
                (element) => ({
                  ...element,
                  width: pointToPixel(element.width),
                  height: pointToPixel(element.height),
                  x: pointToPixel(element.x),
                  y: pointToPixel(element.y),
                  // @ts-expect-error it alright
                  option:
                    element.type === "text"
                      ? {
                          ...element.option,
                          fontSize: pointToPixel(element.option.fontSize),
                        }
                      : undefined,
                })
              );

              setElements(parsedElements);
            };

            file.click();
          }}
        >
          <Import size={16} />
          Importar
        </MenuOption>
      </MenuRoot>
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
                        className="w-full h-full overflow-visible whitespace-break-spaces select-none text-black"
                        // style={{
                        //   fontFamily: "Helvetica",
                        //   fontSize: `${element.option.fontSize}px`,
                        //   color: element.option.color,
                        //   textAlign: element.option.align,
                        //   textDecorationLine:
                        //     element.option.style & UNDERLINE
                        //       ? "underline"
                        //       : undefined,
                        //   fontWeight:
                        //     element.option.style & BOLD ? "bold" : undefined,
                        //   fontStyle:
                        //     element.option.style & ITALIC
                        //       ? "italic"
                        //       : undefined,
                        // }}
                        dangerouslySetInnerHTML={{
                          __html: richTextToHtml(element.content),
                        }}
                      />
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
                    {element.type === "table" && (
                      <div
                        className="w-full h-full select-none"
                        draggable={false}
                      >
                        <table className="w-full text-black [&_td,&_th]:p-2 [&_td,&_th]:text-sm [&_td,&_th]:border [&_th]:text-left">
                          <thead>
                            <tr>
                              {[...Array(element.cols)].map((_, index) => (
                                <th key={index}>Coluna {index + 1}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {[...Array(element.rows)].map((_, rowIndex) => (
                              <tr key={rowIndex}>
                                {[...Array(element.cols)].map((_, colIndex) => (
                                  <td key={colIndex}>
                                    Data {rowIndex + 1}-{colIndex + 1}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
