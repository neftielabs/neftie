import React from "react";

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  onSubmit: () => void;
}

export const Form: React.FC<FormProps> = ({ onSubmit, children, ...props }) => {
  return (
    <form onSubmit={onSubmit} {...props}>
      {children}
    </form>
  );
};
