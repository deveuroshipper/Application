import React from "react";
import Svg, { Path } from "react-native-svg";

const BackArrow = (props: any) => {
  return (
    <Svg
      width={props?.size || 24}
      height={props?.size || 24}
      viewBox="0 0 16 16"
      fill="none"
    >
      <Path
        d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z"
        fill={props.color || "#000000"}
      />
    </Svg>
  );
};

export default BackArrow;
