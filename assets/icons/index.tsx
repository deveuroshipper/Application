import React from "react";
import Apple from "./Apple";
import Arrow from "./Arrow";
import BackArrow from "./BackArrow";
import CloseEye from "./CloseEye";
import Eye from "./Eye";
import Google from "./Google";
import Mail from "./Mail";

const icons = {
  Arrow: Arrow,
  Apple: Apple,
  Google: Google,
  Mail: Mail,
  BackArrow: BackArrow,
  CloseEye: CloseEye,
  Eye: Eye,
};

const Icon = ({ name, ...props }: any) => {
  const IconComponent: any = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={props.color}
      {...props}
    />
  );
};

export default Icon;
