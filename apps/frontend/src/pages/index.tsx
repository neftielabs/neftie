import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import React from "react";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <Page>
      <Box tw="py-10"></Box>
    </Page>
  );
};

export default HomePage;
