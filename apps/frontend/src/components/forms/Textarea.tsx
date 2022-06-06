import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<TextareaProps>((_props, ref) => {
  const { textarea, ...props } = _props as any;
  return (
    <textarea
      ref={ref}
      tw="w-full h-full outline-none bg-transparent
placeholder:text-gray-600 py-1 px-1.5"
      css={{ minHeight: 150 }}
      {...props}
    ></textarea>
  );
});

Textarea.displayName = "Textarea";
