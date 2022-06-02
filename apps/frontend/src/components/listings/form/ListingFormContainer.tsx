import React from "react";

import tw from "twin.macro";

import { NoticeBox } from "components/alerts/NoticeBox";
import type { FileDropProps } from "components/forms/file-drop/FileDrop";
import { FileDrop } from "components/forms/file-drop/FileDrop";
import type { InputProps, TextareaProps } from "components/forms/Input";
import { Input } from "components/forms/Input";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";

type InputCombinedProps = InputProps | TextareaProps;

interface ListingFormContainerProps extends React.ComponentProps<typeof Box> {
  description: string | JSX.Element;
  notice?: {
    children: string | JSX.Element;
    props?: React.ComponentProps<typeof NoticeBox>;
  };
  sections: {
    title: string;
    items: (
      | InputCombinedProps
      | InputCombinedProps[]
      | FileDropProps
      | JSX.Element
    )[];
  }[];
}

export const ListingFormContainer: React.FC<ListingFormContainerProps> = ({
  description,
  notice,
  sections,
  children,
  ...props
}) => {
  return (
    <Box tw="w-3/5" {...props}>
      <Text color="gray500" tw="mb-2">
        {description}
      </Text>

      {notice ? (
        <NoticeBox type="info" style="minimal" tw="mb-3" {...notice.props}>
          {notice.children}
        </NoticeBox>
      ) : null}

      {sections.map((s, si) => (
        <React.Fragment key={s.title + si}>
          <Text
            color="gray500"
            size="md"
            weight="bold"
            css={si === 0 ? tw`mb-3` : tw`my-3`}
          >
            {s.title}
          </Text>

          <Flex column tw="gap-2.5">
            {s.items.map((item, ii) => (
              <React.Fragment key={`item-${ii}`}>
                {Array.isArray(item) ? (
                  <Flex tw="w-full gap-2">
                    {item.map((subItem, sii) => (
                      <Input key={`subitem-${sii}`} {...subItem} />
                    ))}
                  </Flex>
                ) : (
                  <>
                    {"fileFieldName" in item ? (
                      <FileDrop {...item} />
                    ) : (
                      <>{"name" in item ? <Input {...item} /> : item}</>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </Flex>
        </React.Fragment>
      ))}

      {children}
    </Box>
  );
};
