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
  Type,
} from "lucide-react";
import React from "react";
import { Trigger } from "./trigger";
import { generateId, RICH_TEXT_REGEX, richTextToHtml } from "@/util";

export type Match = {
  positionStart: number;
  length: number;
  styles: string;
  text: string;
};

export const BOLD = 1;
export const ITALIC = 2;
export const UNDERLINE = 4;

function joinCamelCase(arr: Array<string>) {
  const [first, ...rest] = arr;

  if (arr.length === 1) {
    return first;
  } else {
    const newArr = [
      first,
      ...rest.map((item) => item.charAt(0).toUpperCase() + item.slice(1)),
    ];

    return newArr.join("");
  }
}

function splitCamelCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .map((item) => item.toLowerCase())
    .join("-");
}

function insertSelectedText(
  textContent: string,
  previousTextLength: number,
  selectedText: string,
  cursorPosition: number
) {
  // console.log("BEFORE", textContent.slice(0, cursorPosition));
  // console.log("INSERT", selectedText);
  // console.log("AFTER", textContent.slice(cursorPosition + previousTextLength));

  return (
    textContent.slice(0, cursorPosition) +
    selectedText +
    textContent.slice(cursorPosition + previousTextLength)
  );
}

const DEFAULT_FORMAT = {
  align: "left",
  color: "#000000",
  fontSize: 16,
  style: 0,
  fontWeight: "normal",
  fontStyle: "normal",
  textDecorationLine: "none",
  textAlign: "left",
};

export function Text() {
  const { addElement, elements } = useElement();

  return (
    <TextDialog
      onDone={({ align, color, fontSize, style, content }) =>
        addElement({
          height: 80,
          width: 80,
          x: 0,
          y: 0,
          id: generateId(elements.length),
          type: "text",
          content,
          option: {
            align,
            color,
            fontSize,
            style,
          },
        })
      }
    ></TextDialog>
  );
}
export function TextDialog(
  props: Partial<{
    fontSize: number;
    align: "left" | "center" | "right" | "justify";
    color: string;
    style: number;
    buttonText: string;
    triggerText: string;
    content: string;
  }> & {
    onDone: (props: {
      fontSize: number;
      align: "left" | "center" | "right" | "justify";
      color: string;
      style: number;
      content: string;
    }) => void;
  }
) {
  const formRef = React.useRef<HTMLFormElement>(null);
  // const [fontSize, setFontSize] = React.useState(props.fontSize || 16);
  // const [align, setAlign] = React.useState<
  //   "left" | "center" | "right" | "justify"
  // >(props.align || "left");
  // const [stylingValue, setStylingValue] = React.useState(props.style || 0);
  // const [color, setColor] = React.useState(props.color || "#000000");
  const [htmlContent, setHtmlContent] = React.useState(
    richTextToHtml(props.content || "")
  );
  const [content, setContent] = React.useState(props.content || "");
  const [format, setFormat] = React.useState({
    align: props.align || "left",
    color: props.color || "#000000",
    fontSize: props.fontSize || 16,
    style: props.style || 0,
    fontWeight: "normal",
    fontStyle: "normal",
    textDecorationLine: "none",
    textAlign: "left",
  });
  const [matches, setMatches] = React.useState<Array<Match>>(() => {
    const matches: Array<Match> = [];

    richTextToHtml(props.content || "", (match, style, position) => {
      matches.push({
        length: match.length,
        styles: style,
        positionStart: position,
        text: match,
      });
    });

    return matches;
  });
  const [selectedText, setSelectedText] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState(0);

  const onFormatChange = (
    field: keyof typeof format,
    value: string | number
  ) => {
    setFormat((prev) => ({ ...prev, [field]: value }));
  };

  const formatSelectedText = (
    field: keyof typeof format,
    value: string | number
  ) => {
    if (selectedText.length !== 0) {
      const fieldCamelCase = splitCamelCase(field);
      let styles = "";
      let textContent = selectedText;
      const isFormatted = RICH_TEXT_REGEX.test(selectedText);

      if (isFormatted) {
        selectedText.replace(RICH_TEXT_REGEX, (_match, text, style) => {
          styles = style;
          textContent = text;
          return "";
        });
      }

      const filteredStyles = styles
        .slice(0, -1)
        .split(";")
        .filter((style) => !style.startsWith(fieldCamelCase))
        .filter((style) => style.length > 0);

      styles =
        filteredStyles.join(";") +
        `${filteredStyles.length > 0 ? ";" : ""}${fieldCamelCase}:${value}${
          field === "fontSize" ? "px" : ""
        };`;
      const formattedText = `[${textContent}]{${styles}}`;

      const newContent = insertSelectedText(
        content,
        selectedText.length,
        formattedText,
        cursorPosition
      );

      setContent(newContent);
      setHtmlContent(richTextToHtml(newContent));
      setSelectedText(formattedText);
    }
    onFormatChange(field, value);
  };

  const styling = (
    <div className="flex flex-row">
      <div>
        <input
          type="checkbox"
          name="bold"
          id="bold"
          className="hidden peer"
          onChange={() =>
            formatSelectedText(
              "fontWeight",
              format.fontWeight === "bold" ? "normal" : "bold"
            )
          }
          checked={format.fontWeight === "bold"}
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
          onChange={() =>
            formatSelectedText(
              "fontStyle",
              format.fontStyle === "italic" ? "normal" : "italic"
            )
          }
          checked={format.fontStyle === "italic"}
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
          onChange={() =>
            formatSelectedText(
              "textDecorationLine",
              format.textDecorationLine === "underline" ? "none" : "underline"
            )
          }
          checked={format.textDecorationLine === "underline"}
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
          onChange={() => formatSelectedText("textAlign", "left")}
          checked={format.textAlign === "left"}
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
          onChange={() => formatSelectedText("textAlign", "center")}
          checked={format.textAlign === "center"}
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
          onChange={() => formatSelectedText("textAlign", "right")}
          checked={format.textAlign === "right"}
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
          onChange={() => formatSelectedText("textAlign", "justify")}
          checked={format.textAlign === "justify"}
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
        value={format.fontSize}
        className="w-20 border border-gray-400 rounded block"
        onChange={(evt) =>
          formatSelectedText("fontSize", Number(evt.target.value))
        }
      />
    </div>
  );

  return (
    <Dialog
      dialogTrigger={
        <Trigger
          title={props.triggerText || "Paragrafo"}
          className="flex flex-row items-center gap-1 bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer"
        >
          <Type size={16} />
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
                className="w-full h-30 border rounded block"
                onSelectCapture={(evt) => {
                  const cursorPosition = evt.currentTarget.selectionStart;
                  const cursorEnd = evt.currentTarget.selectionEnd;

                  const match = matches.find((match) => {
                    if (
                      cursorPosition >= match.positionStart &&
                      cursorPosition <= match.positionStart + match.length
                    ) {
                      return true;
                    }
                    return false;
                  });

                  if (match) {
                    setSelectedText(match.text);
                    match.styles.split(";").forEach((style, index, array) => {
                      if (index === array.length - 1) {
                        return;
                      }

                      const [key, value] = style.split(":");

                      // @ts-expect-error it will belong
                      const camelCaseKey: keyof typeof format = joinCamelCase(
                        key.split("-")
                      );

                      if (key === "font-size") {
                        onFormatChange(
                          "fontSize",
                          Number(value.replace("px", ""))
                        );
                        return;
                      }

                      onFormatChange(camelCaseKey, value);
                    });
                  } else if (cursorPosition !== cursorEnd) {
                    const sub = content.slice(cursorPosition, cursorEnd);
                    setSelectedText(sub);
                    // @ts-expect-error it will belong
                    setFormat(DEFAULT_FORMAT);
                  } else {
                    // @ts-expect-error it will belong
                    setFormat(DEFAULT_FORMAT);
                    setSelectedText("");
                  }
                  setCursorPosition(cursorPosition);
                }}
                // style={{
                //   fontSize,
                //   textAlign: align,
                //   color,
                //   fontStyle: stylingValue & ITALIC ? "italic" : "normal",
                //   //   textDecoration:
                //   textDecorationLine:
                //     stylingValue & UNDERLINE ? "underline" : undefined,
                //   fontWeight: stylingValue & BOLD ? "bold" : "normal",
                // }}
                value={content}
                onChange={(evt) => {
                  const text = evt.target.value;
                  const matches: Array<Match> = [];
                  const html = richTextToHtml(
                    text,
                    (match, style, position) => {
                      matches.push({
                        length: match.length,
                        styles: style,
                        positionStart: position,
                        text: match,
                      });
                    }
                  );
                  setMatches(matches);
                  setHtmlContent(html);
                  setContent(text);
                }}
              ></textarea>
              <input
                type="text"
                className="w-full border-b"
                value={selectedText}
                readOnly
              />
            </div>
            <pre
              className="whitespace-break-spaces"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
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
                onChange={(evt) =>
                  formatSelectedText("color", evt.target.value)
                }
                value={format.color}
              />
            </div>
            <Trigger
              onBeforeClose={() => {
                const formData = new FormData(formRef.current!);
                const datas = Object.fromEntries(formData);
                const { align, color, fontSize, style } = format;

                props.onDone({
                  align,
                  fontSize,
                  style,
                  color,
                  content: datas.texto.toString(),
                });
              }}
              className="bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer w-full"
            >
              {props.buttonText || "Criar"}
            </Trigger>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
