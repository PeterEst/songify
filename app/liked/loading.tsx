"use client";

import Box from "@/components/Box";
import React from "react";
import { HashLoader } from "react-spinners";

const loading = () => {
  return (
    <Box className="h-full flex items-center justify-center">
      <HashLoader color="#06b6d4" size={40} />
    </Box>
  );
};

export default loading;
