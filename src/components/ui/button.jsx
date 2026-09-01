import { cn } from "../../lib/utils";
import { buttonVariants } from "./button-variants";

export function Button({ className, variant, size, type = "button", ...props }) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
