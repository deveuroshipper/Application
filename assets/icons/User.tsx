import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const User = (props: any) => {
  return (
    <Svg
      stroke={props.color || "#000000"}
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      width={props.size || 24}
      height={props.size || 24}
    >
      <Circle cx="12" cy="8" r="5"></Circle>
      <Path d="M20 21a8 8 0 0 0-16 0"></Path>
    </Svg>
  );
};

export default User;
