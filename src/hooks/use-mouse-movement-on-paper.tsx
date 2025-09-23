import React from "react";

export function useMouseMovementOnPaper() {
  const [mousePositionInCanvas, setMousePositionInCanvas] = React.useState({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    function canvasMouseMove(evt: MouseEvent) {
      if (
        "currentTarget" in evt &&
        evt.currentTarget &&
        evt.currentTarget instanceof HTMLDivElement
      ) {
        const rect = evt.currentTarget.getBoundingClientRect();
        const relativeX = Math.abs(rect.x - evt.clientX);
        const relativeY = Math.abs(rect.y - evt.clientY);
        setMousePositionInCanvas(() => ({
          x: relativeX,
          y: relativeY,
        }));
      }
    }

    const paper = document.getElementById("paper")! as HTMLDivElement;
    paper.addEventListener("mousemove", canvasMouseMove);

    return () => {
      paper.removeEventListener("mousemove", canvasMouseMove);
    };
  }, []);

  return mousePositionInCanvas;
}
