import * as React from "react";

import { cn } from "../libs/tailwind-util";
import Icon from "./icon";

export type RadioProps = Omit<React.ComponentProps<"input">, "children" | "type"> & {
  children?: React.ReactNode;
  icon?: React.ReactNode | string;
  iconClassName?: string;
  image?: React.ReactNode | string;
  imageAlt?: string;
  imageClassName?: string;
  imageContainerClassName?: string;
  label?: React.ReactNode;
  labelClassName?: string;
};

function Radio({
  children,
  className,
  icon,
  iconClassName,
  image,
  imageAlt = "",
  imageClassName,
  imageContainerClassName,
  label,
  labelClassName,
  disabled,
  ...props
}: RadioProps) {
  return (
    <label
      data-slot="radio-label"
      className={cn(
        "select-none group flex min-h-10 cursor-pointer items-center gap-2.5 rounded-md border border-input hover:bg-gray-50 bg-background px-3.5 text-sm font-semibold text-foreground transition-all has-[:checked]:border-primary-border has-[:checked]:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/15",
        labelClassName,
      )}
    >
      <span className="relative grid size-4 shrink-0 place-items-center">
        <input
          data-slot="radio"
          type="radio"
          disabled={disabled}
          className={cn(
            "peer absolute inset-0 size-full cursor-pointer appearance-none checked:accent-primary rounded-full border border-input outline-none transition-all checked:border-primary disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        <span className="pointer-events-none size-2 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
      {image ? (
        <span className={cn(imageContainerClassName)}>
          {typeof image === "string" ? (
            <img
              src={image}
              alt={imageAlt}
              className={cn("size-full object-cover", imageClassName)}
            />
          ) : (
            image
          )}
        </span>
      ) : null}
      {icon ? (
        <span className="grid size-4 shrink-0 place-items-center text-muted-foreground transition-colors group-has-[:checked]:text-primary">
          {typeof icon === "string" ? (
            <Icon name={icon} className={cn("size-4", iconClassName)} />
          ) : (
            icon
          )}
        </span>
      ) : null}
      {label ?? children ? (
        <span className="min-w-0 leading-5">{label ?? children}</span>
      ) : null}
    </label>
  );
}

export type RadioGroupProps = Omit<React.ComponentProps<"div">, "role"> &
  (
    | { "aria-label": string; "aria-labelledby"?: never }
    | { "aria-label"?: never; "aria-labelledby": string }
  );

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      data-slot="radio-group"
      className={cn("grid gap-2 sm:grid-cols-2", className)}
      {...props}
    />
  );
}

export { Radio, RadioGroup };
