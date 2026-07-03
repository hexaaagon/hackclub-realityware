import { cn } from "@realityware/util";

export function SiteBody({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "@container/main flex flex-1 flex-col gap-4 px-2 p-4 md:gap-6 md:px-3 md:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
