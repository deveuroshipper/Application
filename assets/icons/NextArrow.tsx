import React from "react";
import Svg, { Path } from "react-native-svg";

const NextArrow = (props: any) => {
  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 14 14"
      fill="none"
    >
      <Path
        d="M10.1458 7.5H0V5.83333H10.1458L5.47917 1.16667L6.66667 0L13.3333 6.66667L6.66667 13.3333L5.47917 12.1667L10.1458 7.5Z"
        fill={props.color || "#000000"}
      />
    </Svg>
  );
};

export default NextArrow;
