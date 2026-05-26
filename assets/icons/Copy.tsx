import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const Copy = (props: any) => {
  return (
    <Svg
      stroke="currentColor"
      fill="#000000"
      strokeWidth="20"
      viewBox="0 0 512 512"
      width={props.size || 24}
      height={props.size || 24}
    >
      <Rect
        width="336"
        height="336"
        x="128"
        y="128"
        fill="none"
        stroke-linejoin="round"
        stroke-width="32"
        rx="57"
        ry="57"
      ></Rect>
      <Path
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="m383.5 128 .5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24"
      ></Path>
    </Svg>
  );
};

export default Copy;
