import React, { useEffect, useState } from "react";

import { FiX } from "react-icons/fi";
import tw from "twin.macro";

import { Backdrop } from "components/ui/Backdrop";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Image } from "components/ui/Image";
import { styled } from "stitches.config";
import { setPageScrollable } from "utils/misc";
import { styleUtils } from "utils/style";

const ImageWrapper = styled(Box, {
  ...tw`z-10 relative`,
  variants: {
    expanded: {
      true: tw`fixed top-0 left-0 w-full h-full overflow-hidden`,
      false: {},
    },
  },
});

interface ExpandableImageProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  imageProps: React.ComponentProps<typeof Image>;
}

export const ExpandableImage: React.FC<ExpandableImageProps> = ({
  imageProps,
  ...props
}) => {
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    setPageScrollable(!isExpanded);
  }, [isExpanded]);

  return (
    <>
      <Button raw onClick={() => setExpanded(true)} {...props}>
        <Image {...imageProps} />
      </Button>
      {isExpanded ? (
        <ImageWrapper expanded={isExpanded}>
          <Box
            tw="max-width[900px] max-height[500px] w-full h-full z-10"
            css={styleUtils.center.xy}
          >
            <Image objectFit="contain" {...imageProps} />
          </Box>
          <Button
            raw
            tw="absolute top-2 right-4 z-20"
            onClick={() => setExpanded(false)}
          >
            <FiX tw="text-white" size={35} />
          </Button>
          <Backdrop visible={isExpanded} onClick={() => setExpanded(false)} />
        </ImageWrapper>
      ) : null}
    </>
  );
};
