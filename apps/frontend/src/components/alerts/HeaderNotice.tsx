import React from "react";

import { FiX } from "react-icons/fi";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Container } from "components/ui/Container";
import { Text } from "components/ui/Text";
import { useHeaderNoticeStore } from "stores/useHeaderNoticeStore";
import { styleUtils } from "utils/style";

interface HeaderNoticeProps {}

export const HeaderNotice: React.FC<HeaderNoticeProps> = () => {
  const [open, closeNotice] = useHeaderNoticeStore((s) => [
    s.open,
    s.closeNotice,
  ]);

  return (
    <>
      {open ? (
        <Box tw="w-full z-20 relative py-1 background-color[#def3ff]">
          <Container tw="relative">
            <Text align="center" size="14" weight="medium">
              neftie is in <strong>beta</strong> and only works with the{" "}
              <strong>Goerli testnet</strong>. Bear with us! 🙏
            </Text>

            <Button
              raw
              css={styleUtils.center.y}
              tw="right-3"
              onClick={() => closeNotice()}
            >
              <FiX />
            </Button>
          </Container>
        </Box>
      ) : null}
    </>
  );
};
