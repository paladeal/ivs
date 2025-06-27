import React from "react";
import { ReactNode, ComponentPropsWithRef } from "react";
type Variant = "gray" | "rose-gray";
interface Props extends ComponentPropsWithRef<"button"> {
  children: ReactNode;
  variant?: Variant;
}

export const Button: React.FC<Props> = ({
  children,
  variant = "gray",
  className,
  ...otherProps
}) => {
  const bgColor = variant === "gray" ? "bg-gray-light" : "bg-rose-gray";
  return (
    <button
      {...otherProps}
      className={ className ?? `w-full h-full cursor-pointer font-bold ${bgColor} hover:bg-gray-dark hover:text-white`}
    >
      {children}
    </button>
  );
};
