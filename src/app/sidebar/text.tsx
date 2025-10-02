"use client";

import Dialog from "@/components/domain/dialog";
import { useElement } from "@/context";
import {
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import React from "react";
import { Trigger } from "./trigger";

export const BOLD = 1;
export const ITALIC = 2;
export const UNDERLINE = 4;

export function Text() {
  const { addElement, elements } = useElement();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [fontSize, setFontSize] = React.useState(16);
  const [align, setAlign] = React.useState<
    "left" | "center" | "right" | "justify"
  >("left");
  const [stylingValue, setStylingValue] = React.useState(0);
  const [color, setColor] = React.useState("#000000");

  const styling = (
    <div className="flex flex-row">
      <div>
        <input
          type="checkbox"
          name="bold"
          id="bold"
          className="hidden peer"
          onChange={() => setStylingValue(stylingValue ^ BOLD)}
          checked={(stylingValue & BOLD) !== 0}
        />
        <label
          htmlFor="bold"
          className="flex flex-row justify-center peer-checked:bg-blue-400 peer-checked:text-white items-center size-6 bg-gray-400"
        >
          <Bold size={16} />
        </label>
      </div>
      <div>
        <input
          type="checkbox"
          name="italic"
          id="italic"
          className="hidden peer"
          onChange={() => setStylingValue(stylingValue ^ ITALIC)}
          checked={(stylingValue & ITALIC) !== 0}
        />
        <label
          htmlFor="italic"
          className="flex flex-row justify-center peer-checked:bg-blue-400 peer-checked:text-white items-center size-6 bg-gray-400"
        >
          <Italic size={16} />
        </label>
      </div>
      <div>
        <input
          type="checkbox"
          name="underline"
          id="underline"
          className="hidden peer"
          onChange={() => setStylingValue(stylingValue ^ UNDERLINE)}
          checked={(stylingValue & UNDERLINE) !== 0}
        />
        <label
          htmlFor="underline"
          className="flex flex-row justify-center peer-checked:bg-blue-400 peer-checked:text-white items-center size-6 bg-gray-400"
        >
          <Underline size={16} />
        </label>
      </div>
    </div>
  );
  const alignment = (
    <div className="flex flex-row">
      <div>
        <input
          type="radio"
          name="align"
          id="align-left"
          className="hidden peer"
          onChange={() => setAlign("left")}
          checked={align === "left"}
        />
        <label
          htmlFor="align-left"
          className="flex flex-row justify-center peer-checked:bg-blue-400 peer-checked:text-white items-center size-6 bg-gray-400"
        >
          <TextAlignStart size={16} />
        </label>
      </div>
      <div>
        <input
          type="radio"
          name="align"
          id="align-center"
          className="hidden peer"
          onChange={() => setAlign("center")}
          checked={align === "center"}
        />
        <label
          htmlFor="align-center"
          className="flex flex-row justify-center peer-checked:bg-blue-400 peer-checked:text-white items-center size-6 bg-gray-400"
        >
          <TextAlignCenter size={16} />
        </label>
      </div>
      <div>
        <input
          type="radio"
          name="align"
          id="align-right"
          className="hidden peer"
          onChange={() => setAlign("right")}
          checked={align === "right"}
        />
        <label
          htmlFor="align-right"
          className="flex flex-row justify-center peer-checked:bg-blue-400 peer-checked:text-white items-center size-6 bg-gray-400"
        >
          <TextAlignEnd size={16} />
        </label>
      </div>
      <div>
        <input
          type="radio"
          name="align"
          id="align-justify"
          className="hidden peer"
          onChange={() => setAlign("justify")}
          checked={align === "justify"}
        />
        <label
          htmlFor="align-justify"
          className="flex flex-row justify-center peer-checked:bg-blue-400 peer-checked:text-white items-center size-6 bg-gray-400"
        >
          <TextAlignJustify size={16} />
        </label>
      </div>
    </div>
  );
  const textSize = (
    <div className="space-x-2">
      <label htmlFor="fontSize">Tamanho</label>
      <input
        type="number"
        name="fontSize"
        id="fontSize"
        value={fontSize}
        className="w-20 border border-gray-400 rounded block"
        onChange={(evt) => setFontSize(Number(evt.target.value))}
      />
    </div>
  );

  return (
    <Dialog
      dialogTrigger={
        <Trigger className="bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer">
          Texto
        </Trigger>
      }
    >
      <div className="p-6">
        <form
          ref={formRef}
          action="#"
          onSubmit={(evt) => {
            evt.preventDefault();
            //   const formData = new FormData(evt.currentTarget);
            //   console.log(Object.fromEntries(formData));
          }}
          // className=""
        >
          <div className="space-y-4 text-slate-800">
            <div className="space-y-2">
              <label htmlFor="texto" className="font-bold text-lg">
                Paragrafo
              </label>
              <textarea
                name="texto"
                id="texto"
                cols={6}
                className="w-80 h-30 border rounded block"
                style={{
                  fontSize,
                  textAlign: align,
                  color,
                  fontStyle: stylingValue & ITALIC ? "italic" : "normal",
                  //   textDecoration:
                  textDecorationLine:
                    stylingValue & UNDERLINE ? "underline" : undefined,
                  fontWeight: stylingValue & BOLD ? "bold" : "normal",
                }}
              ></textarea>
            </div>
            <div className="flex flex-row items-center gap-2">
              {textSize}
              <div>
                <p>Alinhamento</p>
                {alignment}
              </div>
              <div>
                <p>Estilo</p>
                {styling}
              </div>
            </div>
            <div className="space-x-2">
              <label htmlFor="color">Cor</label>
              <input
                type="color"
                name="color"
                id="color"
                onChange={(evt) => setColor(evt.target.value)}
              />
            </div>
            <Trigger
              onBeforeClose={() => {
                const formData = new FormData(formRef.current!);
                const datas = Object.fromEntries(formData);

                addElement({
                  height: 80,
                  width: 80,
                  x: 0,
                  y: 0,
                  id: Math.round(
                    Math.random() * 1000 + elements.length + 1 + Date.now()
                  ),
                  type: "text",
                  content: datas.texto.toString(),
                  option: {
                    align,
                    color,
                    fontSize,
                    style: stylingValue,
                  },
                });

                setAlign("left");
                setFontSize(16);
                setColor("#000000");
                setStylingValue(0);
              }}
              className="bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer w-full"
            >
              Criar
            </Trigger>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
