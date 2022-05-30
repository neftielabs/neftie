import React from "react";

import { useField } from "formik";
import tw from "twin.macro";

import { Label } from "components/forms/Label";
import { Textarea } from "components/forms/Textarea";
import { Box } from "components/ui/Box";
import { Text } from "components/ui/Text";
import { styled } from "stitches.config";

const InputContainer = styled(Box, {
  ...tw`border transition relative rounded-12`,
  variants: {
    error: {
      true: tw`border-error`,
      false: tw`border-gray-150 focus-within:border-gray-900`,
    },
    disabled: {
      true: tw`bg-gray-100`,
      false: tw``,
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
  },
});

const InputElement = styled("input", {
  ...tw`w-full h-full outline-none bg-transparent placeholder:text-gray-600
  py-1 px-1.5`,
});

interface CommonProps {
  name: string;
  label?: string;
  containerProps?: React.ComponentProps<typeof Box>;
  help?: string;
}

export type InputProps = CommonProps &
  React.ComponentProps<typeof InputElement>;
export type TextareaProps = CommonProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    textarea: true;
  };

// eslint-disable-next-line comma-spacing
export const Input = ({
  label,
  name,
  containerProps,
  help,
  children,
  ...props
}: InputProps | TextareaProps): JSX.Element => {
  const [field, meta] = useField(name);

  return (
    <Box {...containerProps}>
      {label ? (
        <Box tw="mb-1 ml-0.5">
          <Label htmlFor={name}>
            {label}{" "}
            {props.required ? (
              <Text as="span" color="error">
                *
              </Text>
            ) : null}
          </Label>
          {help ? (
            <Text size="13" tw="mt-0.3" color="gray500">
              {help}
            </Text>
          ) : null}
        </Box>
      ) : null}

      <InputContainer
        error={!!meta.error && !!meta.touched}
        disabled={props.disabled}
      >
        {"textarea" in props ? (
          <Textarea id={name} {...field} {...props}></Textarea>
        ) : (
          <InputElement id={name} {...field} {...props} />
        )}

        {children}
      </InputContainer>
      {meta.error && meta.touched ? (
        <Box tw="mt-1">
          <Text color="error" size="13">
            {meta.error}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};
