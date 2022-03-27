import { NeftieLogo } from "components/assets/NeftieLogo";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import React from "react";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { routes } from "lib/manifests/routes";
import { FooterColumn } from "components/footers/FooterColumn";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const socials = [
    {
      icon: <IoLogoFacebook />,
      alt: "Facebook",
      url: "https://facebook.com",
    },
    {
      icon: <IoLogoInstagram />,
      alt: "Instagram",
      url: "https://instagram.com/neftie.io",
    },
    {
      icon: <FaDiscord />,
      alt: "Discord",
      url: "https://discord.com",
    },
    {
      icon: <FaGithub />,
      alt: "Github",
      url: "https://github.com/neftielabs",
      sizeOverride: 20,
    },
  ];

  const columns = [
    {
      heading: "Discover",
      items: [
        ["All services", "/"],
        ["Trending now", "/"],
      ],
    },
    {
      heading: "Categories",
      items: [["Art", "/"]],
    },
    {
      heading: "Company",
      items: [
        ["About", routes.about],
        ["Careers", routes.careers],
        ["Privacy Policy", routes.privacyPolicy],
        ["Terms of Service", routes.termsOfService],
      ],
    },
  ];

  return (
    <Box tw="w-full bg-brand-black py-10 text-brand-white">
      <Box tw="container">
        <Flex column tw="divide-y divide-gray-800">
          <Flex tw="pb-4 gap-15">
            <Flex column tw="gap-4">
              <NeftieLogo />
              <Text color="gray400">
                Neftie is the platform for digital creators
              </Text>
            </Flex>
            <Flex tw="gap-10" grow>
              {columns.map((c) => (
                <FooterColumn key={c.heading} {...c} />
              ))}
            </Flex>
          </Flex>
          <Flex justifyBetween tw="pt-2">
            <Text color="gray400">
              &copy; {new Date().getFullYear()} Neftie Labs
            </Text>
            <Flex itemsCenter tw="gap-1.5">
              {socials.map((s) => (
                <Link
                  key={s.alt}
                  href={s.url}
                  variant="whiteToLighter"
                  target="_blank"
                >
                  {React.cloneElement(s.icon, { size: s.sizeOverride || "22" })}
                </Link>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
