import React from "react";
import Svg, { Path } from "react-native-svg";

const Check = (props: any) => {
  return (
    <Svg
      stroke="currentColor"
      fill={props.color || "#000000"}
      stroke-width="0"
      viewBox="0 0 448 512"
      width={props.size || 24}
      height={props.size || 24}
    >
      <Path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></Path>
    </Svg>
  );
};

export default Check;
