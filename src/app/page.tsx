"use client";
import React from "react";
import DraggableContent from "./draggable-content";
import { usePaper } from "@/context";
import { Ruler, RulerMousePosition } from "@/components/domain";

const ONE_CENTIMETER_IN_POINT = 28.346;

export default function Home() {
  const { setMousePositionInCanvas, setViewPointScrollValue } = usePaper();
  const [pageViewport, setPageViewport] = React.useState({
    width: 0,
    height: 0,
  });
  const [mousePosition, setMousePosition] = React.useState({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    const canvas = document.getElementById("canvas")!;

    const handleCanvasScroll = () => {
      setViewPointScrollValue((prev) => ({ ...prev, y: canvas.scrollTop }));
    };

    canvas.addEventListener("scroll", handleCanvasScroll);
    return () => {
      canvas.removeEventListener("scroll", handleCanvasScroll);
    };
  }, [setViewPointScrollValue]);

  React.useEffect(() => {
    const handleMouseMove = (evt: MouseEvent) => {
      setMousePosition((prev) => ({ ...prev, x: evt.pageX, y: evt.pageY }));
    };
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
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
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
          <RulerMousePosition mousePosition={mousePosition} />
        </Ruler>
      </div>
      <div className="h-full overflow-auto">
        <div className="h-full flex flex-row">
          <div className="h-full overflow-hidden">
            <Ruler
              base_distance_between_units={ONE_CENTIMETER_IN_POINT}
              rule_size={Math.ceil(
                pageViewport.width / ONE_CENTIMETER_IN_POINT / 1.4
              )}
              vertical
            >
              <RulerMousePosition mousePosition={mousePosition} vertical />
            </Ruler>
          </div>
          <div id="canvas" className="h-full w-full p-6 overflow-auto">
            <div
              id="paper"
              className="w-[791.72px] h-[1119.71px] mx-auto relative overflow-hidden"
              onMouseMove={(evt) => {
                const rect = evt.currentTarget.getBoundingClientRect();
                const relativeX = Math.abs(rect.x - evt.clientX);
                const relativeY = Math.abs(rect.y - evt.clientY);
                setMousePositionInCanvas((prev) => ({
                  ...prev,
                  x: relativeX,
                  y: relativeY,
                }));
              }}
            >
              <DraggableContent>
                <div className="size-20 bg-red-600"></div>
              </DraggableContent>
              <DraggableContent>
                <div className="size-20 bg-blue-600"></div>
              </DraggableContent>

              <div className="bg-white w-full h-full mx-auto shadow-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
