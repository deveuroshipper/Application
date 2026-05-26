import React from "react";
import Svg, { Path } from "react-native-svg";

const Door = (props: any) => {
  return (
    <Svg
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      height={props.size || 24}
      width={props.size || 24}
    >
      <Path
        d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"
        fill={props.color || "#000000"}
      ></Path>
      <Path d="M2 20h20" fill={props.color || "#000000"}></Path>
      <Path d="M14 12v.01" fill={props.color || "#000000"}></Path>
    </Svg>
  );
};

export default Door;
