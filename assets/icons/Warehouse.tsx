import React from "react";
import Svg, { Path } from "react-native-svg";

const Warehouse = (props: any) => {
  return (
    <Svg
      stroke="currentColor"
      fill={props.color || "#000000"}
      strokeWidth="0.6"
      viewBox="0 0 32 32"
      width={props.size || 24}
      height={props.size || 24}
    >
      <Path d="M 16 4.90625 L 3.625 10.0625 L 3 10.34375 L 3 27 L 29 27 L 29 10.34375 L 28.375 10.0625 Z M 16 7.09375 L 27 11.6875 L 27 25 L 25 25 L 25 14 L 7 14 L 7 25 L 5 25 L 5 11.6875 Z M 9 16 L 23 16 L 23 25 L 9 25 Z"></Path>
    </Svg>
  );
};

export default Warehouse;
