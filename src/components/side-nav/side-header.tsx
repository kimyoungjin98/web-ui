import { Paragraph } from "../typography/paragraph";

export const SideHeader = ({
  title,
  isSidebarCollapsed = false,
  rightButton,
}: {
  title: string;
  isSidebarCollapsed?: boolean;
  rightButton?: React.ReactNode;
}) => {
  return (
    <div
      className={`flex items-center px-4 py-3 ${
        isSidebarCollapsed ? "justify-center" : "justify-between"
      }`}
    >
      {isSidebarCollapsed ? null : (
        <Paragraph
          typography="t6"
          fontWeight="semibold"
          className="text-muted-foreground/70"
        >
          {title}
        </Paragraph>
      )}
      {rightButton ? rightButton : null}
    </div>
  );
};
