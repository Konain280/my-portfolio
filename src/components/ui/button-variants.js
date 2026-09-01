import { cva } from "class-variance-authority";

export const buttonVariants = cva("ui-button", {
  variants: {
    variant: { primary: "ui-button-primary", outline: "ui-button-outline", ghost: "ui-button-ghost" },
    size: { default: "ui-button-default", icon: "ui-button-icon" },
  },
  defaultVariants: { variant: "primary", size: "default" },
});
