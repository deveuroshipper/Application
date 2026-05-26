import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const CalendarCheck = (props: any) => {
  return (
    <Svg
      stroke={props.color || "#000000"}
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      height={props.size || 24}
      width={props.size || 24}
    >
      <Path d="M8 2v4" fill={props.color || "#000000"}></Path>
      <Path d="M16 2v4" fill={props.color || "#000000"}></Path>
      <Rect width="18" height="18" x="3" y="4" rx="2"></Rect>
      <Path d="M3 10h18" fill={props.color || "#000000"}></Path>
      <Path d="m9 16 2 2 4-4" fill={props.color || "#000000"}></Path>
    </Svg>
  );
};

export default CalendarCheck;
