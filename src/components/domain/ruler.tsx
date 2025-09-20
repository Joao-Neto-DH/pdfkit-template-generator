"use client";
import { usePaper } from "@/context";
import React from "react";

export interface RuleProps {
  vertical?: boolean;
  rule_size: number;
  base_distance_between_units: number;
  children?: React.ReactNode;
}

const STICKS_BETWEEN_NUMBERS = 5;

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
                  <span className="w-1 border-t-red-800 border-t"></span>
                  <span className="text-[8px]">{idx + 1}</span>
                </li>
              ))}
              {/* <li
              className="absolute bg-inherit top-0 left-0 z-10 w-full"
              style={{ height: `${props.base_distance_between_units}pt` }}
            ></li> */}
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
        <ul className="flex bg-inherit flex-row text-black py-0.5 overflow-x-hidden relative">
          <li>
            <span className="inline-block w-5.5"></span>
          </li>
          {Array.from({
            length: props.rule_size * 2,
          }).map((_, idx) => (
            <React.Fragment key={idx}>
              <li
                style={{
                  marginLeft: `${props.base_distance_between_units}pt`,
                }}
                className="relative flex flex-col items-center justify-center gap-0.5 w-0"
              >
                <span className="h-1 border-r-red-800 border-r"></span>
                <span className="text-[8px]">{idx + 1}</span>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
      {props.children}
    </div>
  );
}

export interface RulerMousePositionProps {
  mousePosition: { x: number; y: number };
  vertical?: boolean;
}

export function RulerMousePosition(props: RulerMousePositionProps) {
  if (props.vertical) {
    return (
      <span
        className="fixed left-0 w-5.5 border-dashed border-t-gray-800 border-t"
        style={{
          top: `${props.mousePosition.y < 22 ? 22 : props.mousePosition.y}px`,
        }}
      ></span>
    );
  }

  return (
    <span
      className="absolute top-0 h-5.5 border-dashed border-r-gray-800 border-r"
      style={{
        left: `${props.mousePosition.x < 22 ? 22 : props.mousePosition.x}px`,
      }}
    ></span>
  );
}
