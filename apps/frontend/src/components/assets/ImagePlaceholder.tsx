import { Image } from "components/ui/Image";
import React from "react";

interface ImagePlaceholderProps
  extends Partial<React.ComponentProps<typeof Image>> {}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  ...props
}) => {
  return <Image src="/no-image.jpg" alt="No image available" {...props} />;
};
