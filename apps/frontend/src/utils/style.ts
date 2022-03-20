import tw from "twin.macro";

export const styleUtils = {
  center: {
    xy: tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`,
    left: tw`absolute top-2/4 left-0 transform -translate-y-1/2`,
    right: tw`absolute top-2/4 right-0 transform -translate-y-1/2`,
    y: tw`absolute top-2/4 transform -translate-y-1/2`,
    x: tw`absolute left-2/4 transform -translate-x-1/2`,
  },
};
