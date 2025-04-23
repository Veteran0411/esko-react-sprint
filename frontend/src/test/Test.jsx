import React from "react";
import { Box } from "@mui/material";

const HoverDivs = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: 300,
        height: 200,
        overflow: "hidden",
        border: "1px solid #ccc",
        "&:hover .hoverDiv": {
          transform: "translateY(0%)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "lightblue",
          zIndex: 1,
        }}
      >
        Div 1 (Base)
      </Box>

      <Box
        className="hoverDiv"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "lightcoral",
          transform: "translateY(100%)",
          transition: "transform 0.4s ease",
          zIndex: 2,
        }}
      >
        Div 2 (On Hover)
      </Box>
    </Box>
  );
};

export default HoverDivs;
