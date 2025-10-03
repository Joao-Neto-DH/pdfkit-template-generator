"use client";
import Dialog from "@/components/domain/dialog";
import { Trigger } from "./trigger";
import React from "react";
import { useElement } from "@/context";
import { generateId } from "@/util";
import { ImageIcon } from "lucide-react";

export async function getImageData(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const canvas = document.createElement("canvas");
    const image = new Image();

    image.src = url;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d")!.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL(file.type);
      resolve(dataUrl);
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
}

export function ImageElement() {
  const { addElement, elements } = useElement();
  const [size, setSize] = React.useState({ width: 100, height: 100 });
  const [image, setImage] = React.useState<string>();

  return (
    <Dialog
      dialogTrigger={
        <Trigger
          title={"Imagem"}
          className="flex flex-row items-center gap-1 bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer"
        >
          <ImageIcon size={16} />
        </Trigger>
      }
    >
      <form onSubmit={(e) => e.preventDefault()} className="p-4">
        <div className="space-y-4 text-slate-800">
          <p className="font-bold">Previsualizar imagem</p>
          <div className="w-full h-50 border rounded overflow-hidden">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Imagem"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="grid grid-cols-2">
            <div className="flex">
              <label className="mr-2">L</label>
              <input
                type="number"
                className="border rounded"
                value={size.width}
                onChange={(e) =>
                  setSize({ ...size, width: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex">
              <label className="mr-2">H</label>
              <input
                type="number"
                className="border rounded"
                value={size.height}
                onChange={(e) =>
                  setSize({ ...size, height: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="flex">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files![0];
                const dataUrl = await getImageData(file);
                setImage(dataUrl);

                // canvas.getContext("2d")!.drawImage(blob, 0, 0, 100, 100);
                // setImage(URL.createObjectURL(e.target.files![0]));
              }}
            />
          </div>
          <Trigger
            onBeforeClose={() => {
              if (!image) {
                alert("Selecione uma imagem");
                return false;
              }

              addElement({
                type: "image",
                height: size.height,
                width: size.width,
                x: 0,
                y: 0,
                id: generateId(elements.length),
                src: image,
              });

              setImage(undefined);
              setSize({ width: 100, height: 100 });
            }}
            className="bg-blue-400 hover:bg-blue-500 transition-colors p-2 rounded cursor-pointer w-full"
          >
            Criar
          </Trigger>
        </div>
      </form>
    </Dialog>
  );
}
