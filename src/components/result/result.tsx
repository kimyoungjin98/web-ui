import type { ComponentPropsWithRef, ReactNode } from "react";
import { Button, type ButtonProps } from "../button/button";
import { cn } from "../../libs/tailwind-util";
import { Paragraph } from "../typography/paragraph";

export type ResultProps = Omit<ComponentPropsWithRef<"section">, "title"> & {
  figure?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  button?: ReactNode;
};

function ResultRoot({
  figure,
  title,
  description,
  button,
  className,
  ...props
}: ResultProps) {
  return (
    <section
      {...props}
      className={cn(
        "ds-result flex min-h-80 w-full flex-col items-center justify-center gap-6 px-6 py-12 text-center",
        className,
      )}
    >
      {figure != null && (
        <div data-result-figure="" aria-hidden="true">
          {figure}
        </div>
      )}
      <div className="flex flex-col gap-3">
        <Paragraph typography="t5" fontWeight="semibold">
          {title}
        </Paragraph>
        {description != null && (
          <Paragraph
            data-result-description=""
            typography="t6"
            className="font-normal text-muted-foreground"
          >
            {description}
          </Paragraph>
        )}
      </div>
      {button != null && (
        <div data-result-button="" className="flex w-full justify-center gap-2">
          {button}
        </div>
      )}
    </section>
  );
}

function ResultButton(props: ButtonProps) {
  return <Button size="sm" {...props} />;
}

export const Result = Object.assign(ResultRoot, { Button: ResultButton });
