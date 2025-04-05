import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `
        peer 
        bg-white 
        dark:bg-zinc-800/40 
        border border-gray-300 
        dark:border-zinc-600
        data-[state=checked]:bg-blue-600 
        data-[state=checked]:border-blue-600 
        data-[state=checked]:text-white 
        dark:data-[state=checked]:bg-blue-500 
        dark:data-[state=checked]:border-blue-500
        focus-visible:border-blue-500 
        focus-visible:ring-2 
        focus-visible:ring-blue-300/50 
        dark:focus-visible:ring-blue-500/40 
        aria-invalid:ring-red-400/20 
        dark:aria-invalid:ring-red-400/40 
        aria-invalid:border-red-500 
        size-4 
        shrink-0 
        rounded-[4px] 
        shadow-xs 
        transition-shadow 
        outline-none 
        disabled:cursor-not-allowed 
        disabled:opacity-50
        `,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
