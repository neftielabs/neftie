import React from "react";

import { Image } from "components/ui/Image";

interface ImagePlaceholderProps
  extends Partial<React.ComponentProps<typeof Image>> {}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  ...props
}) => {
  return <Image src="/no-image.jpg" alt="No image available" {...props} />;
};
