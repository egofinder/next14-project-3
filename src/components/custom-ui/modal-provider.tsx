"use client";

import { useEffect, useState } from "react";
import { ProModal } from "./pro-modal";

export const ModalProvider = () => {
  // TODO: Hydration 에러를 고치는 트릭인데 좀더 자세히 이해해보기

  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // if (!isMounted) return null;

  return <ProModal />;
};
