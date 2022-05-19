import React from "react";

import {
  IUseIntersectionObserverOptions,
  useIntersectionObserver,
} from "@react-hookz/web";

interface InfiniteScrollProps {
  ref: Element | React.RefObject<Element> | null;
  options?: IUseIntersectionObserverOptions;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  ref,
  options,
  children,
}) => {
  const intersection = useIntersectionObserver(ref, options);

  return <>{children}</>;
};
