"use client";

import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Icon } from "../icon";
import { cn } from "../../libs/tailwind-util";
import type { FileUploaderLabels } from "./types/types";

const FRAME =
  "grid cursor-pointer place-items-center rounded-lg border border-dashed p-4 text-center transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/25";
const IDLE_FRAME =
  "border-primary/30 bg-card hover:border-primary/60 hover:bg-primary/5 hover:shadow-sm focus-visible:border-primary/70 focus-visible:bg-primary/5";
const READY_FRAME =
  "border-primary bg-primary/10 shadow-sm ring-3 ring-primary/15";
const DISABLED_FRAME = "pointer-events-none opacity-50";

type Props = {
  accept: string;
  disabled?: boolean;
  help: string;
  labels?: FileUploaderLabels;
  multiple?: boolean;
  onFiles: (files: FileList) => void;
};

export function DropZone(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const drop = useDrop(props.disabled, props.onFiles);
  return (
    <>
      <DropInput
        ref={inputRef}
        accept={props.accept}
        multiple={props.multiple}
        disabled={props.disabled}
        onFiles={props.onFiles}
      />
      <DropFrame
        disabled={props.disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={drop.dragOver}
        onDragLeave={drop.leave}
        onDrop={drop.drop}
        over={drop.over}
      >
        <DropContent
          guide={props.labels?.guide}
          help={props.help}
          idle={props.labels?.idle}
          over={drop.over}
          overLabel={props.labels?.over}
        />
      </DropFrame>
    </>
  );
}

function useDrop(
  disabled: boolean | undefined,
  onFiles: (files: FileList) => void,
) {
  const [over, setOver] = useState(false);

  function dragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setOver(true);
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setOver(false);
    if (!disabled) onFiles(event.dataTransfer.files);
  }

  return {
    dragOver,
    drop,
    leave: () => setOver(false),
    over,
  };
}

type InputProps = {
  accept: string;
  disabled?: boolean;
  multiple?: boolean;
  onFiles: (files: FileList) => void;
};

const DropInput = forwardRef<HTMLInputElement, InputProps>(function DropInput(
  { accept, disabled, multiple, onFiles },
  ref,
) {
  function change(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) onFiles(event.target.files);
    event.target.value = "";
  }
  return (
    <input
      ref={ref}
      className="hidden"
      type="file"
      accept={accept || undefined}
      aria-hidden="true"
      tabIndex={-1}
      multiple={multiple}
      disabled={disabled}
      onChange={change}
    />
  );
});

type FrameProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  onDragLeave: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  over: boolean;
};

function DropFrame(props: FrameProps) {
  const keydown = usePickKey(props.onClick);
  const click = (event: React.MouseEvent) => {
    event.preventDefault();
    props.onClick();
  };

  return (
    <div
      role="button"
      tabIndex={props.disabled ? -1 : 0}
      aria-label="파일 업로드 영역"
      aria-disabled={props.disabled || undefined}
      onClick={click}
      onKeyDown={keydown}
      onDragOver={props.onDragOver}
      onDragLeave={props.onDragLeave}
      onDrop={props.onDrop}
      className={cn(
        FRAME,
        props.over ? READY_FRAME : IDLE_FRAME,
        props.disabled && DISABLED_FRAME,
      )}
    >
      {props.children}
    </div>
  );
}

function usePickKey(onPick: () => void) {
  return function keydown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPick();
    }
  };
}

function DropContent({
  guide,
  help,
  idle,
  over,
  overLabel,
}: {
  guide?: string;
  help: string;
  idle?: string;
  over: boolean;
  overLabel?: string;
}) {
  return (
    <>
      <Icon
        name="material-symbols:cloud-download-outline"
        className={`mb-3 size-8 transition ${over ? "text-primary" : "text-primary/80"}`}
      />
      <p className="font-medium text-base-content">
        {over
          ? (overLabel ?? "파일을 여기에 놓으세요")
          : (idle ?? "파일을 업로드하세요")}
      </p>
      <p className="mt-2 text-xs font-normal text-muted-foreground">
        {guide ?? "파일을 이곳에 드래그하거나 이 영역을 클릭하세요"}
      </p>
      <p className="mt-4 text-xs font-normal text-muted-foreground">{help}</p>
    </>
  );
}
