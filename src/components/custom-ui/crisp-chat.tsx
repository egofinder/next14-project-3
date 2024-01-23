"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

import React from "react";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("07b00cd2-7be4-4d4f-af0a-64d8ec9daec3");
  }, []);

  return null;
};
