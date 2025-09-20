"use client";
import { usePaper } from "@/context";
import React from "react";

export interface RuleProps {
  vertical?: boolean;
  rule_size: number;
  base_distance_between_units: number;
  children?: React.ReactNode;
}

export function Ruler(props: RuleProps) {
  const { viewPointScrollValue } = usePaper();

  if (props.vertical) {
    return (
      <div className="relative">
        <div
          className="h-full w-5.5 bg-white"
          style={{ transform: `translateY(-${viewPointScrollValue.y}px)` }}
        >
          <div className="relative bg-inherit">
            <ul className="flex flex-col bg-inherit text-black px-0.5 overflow-y-hidden relative">
              {Array.from({
                length: props.rule_size * 2,
              }).map((_, idx) => (
                <li
                  key={idx}
                  style={{
                    marginTop: `${props.base_distance_between_units}pt`,
                  }}
                  className="relative flex flex-row items-center justify-center gap-0.5 h-0"
                >
                  <Stick
                    vertical
                    base_distance_between_units={
                      -props.base_distance_between_units / 2
                    }
                  />
                  <Stick
                    vertical
                    base_distance_between_units={
                      -props.base_distance_between_units / 4
                    }
                  />
                  <span className="w-1 border-t-gray-600 border-t"></span>

                  <Stick
                    vertical
                    base_distance_between_units={
                      props.base_distance_between_units / 2
                    }
                  />
                  <Stick
                    vertical
                    base_distance_between_units={
                      props.base_distance_between_units / 4
                    }
                  />
                  <span className="text-[8px]">{idx + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {props.children}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="min-h-5.5 h-5.5 bg-white relative">
        <ul
          className="flex bg-inherit flex-row text-black py-0.5 overflow-x-hidden relative"
          style={{ transform: `translateX(-${viewPointScrollValue.x}px)` }}
        >
          <li>
            <span className="inline-block w-5.5"></span>
          </li>
          {Array.from({
            length: props.rule_size * 2,
          }).map((_, idx) => (
            <li
              key={idx}
              style={{
                marginLeft: `${props.base_distance_between_units}pt`,
              }}
              className="relative flex flex-col items-center justify-center gap-0.5 w-0"
            >
              <Stick
                base_distance_between_units={
                  -props.base_distance_between_units / 2
                }
              />
              <Stick
                base_distance_between_units={
                  -props.base_distance_between_units / 4
                }
              />
              <span
                className="absolute top-0.5 h-1 border-r-gray-400 border-r"
                style={{
                  transform: `translateX(-${
                    props.base_distance_between_units / 2
                  }pt)`,
                }}
              ></span>
              <Stick
                base_distance_between_units={
                  props.base_distance_between_units / 2
                }
              />
              <Stick
                base_distance_between_units={
                  props.base_distance_between_units / 4
                }
              />

              <span className="h-1 border-r-gray-600 border-r"></span>
              <span className="text-[8px]">{idx + 1}</span>
            </li>
          ))}
        </ul>
      </div>
      {props.children}
    </div>
  );
}

function Stick(
  props: Pick<RuleProps, "base_distance_between_units" | "vertical">
) {
  if (props.vertical) {
    return (
      <span
        className="absolute left-0.5 w-1 border-t-gray-400 border-t"
        style={{
          transform: `translateY(${props.base_distance_between_units}pt)`,
        }}
      ></span>
    );
  }

  return (
    <span
      className="absolute top-0.5 h-1 border-r-gray-400 border-r"
      style={{
        transform: `translateX(${props.base_distance_between_units}pt)`,
      }}
    ></span>
  );
}

export interface RulerMousePositionProps {
  // mousePosition: { x: number; y: number };
  vertical?: boolean;
}

export function RulerMousePosition(props: RulerMousePositionProps) {
  const [mousePosition, setMousePosition] = React.useState({
    x: 0,
    y: 0,
  });
  React.useEffect(() => {
    const handleMouseMove = (evt: MouseEvent) => {
      setMousePosition((prev) => ({ ...prev, x: evt.pageX, y: evt.pageY }));
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (props.vertical) {
    return (
      <span
        className="fixed left-0 w-5.5 border-dashed border-t-gray-800 border-t"
        style={{
          top: `${mousePosition.y < 22 ? 22 : mousePosition.y}px`,
        }}
      ></span>
    );
  }

  return (
    <span
      className="absolute top-0 h-5.5 border-dashed border-r-gray-800 border-r"
      style={{
        left: `${mousePosition.x < 22 ? 22 : mousePosition.x}px`,
      }}
    ></span>
  );
}
