import React from "react";
import Apple from "./Apple";
import Arrow from "./Arrow";
import BackArrow from "./BackArrow";
import Bell from "./Bell";
import Box from "./Box";
import CalendarCheck from "./CalendarCheck";
import Cart from "./Cart";
import Check from "./Check";
import CloseEye from "./CloseEye";
import Copy from "./Copy";
import Dollar from "./Dollar";
import Door from "./Door";
import Eye from "./Eye";
import Google from "./Google";
import Info from "./Info";
import Mail from "./Mail";
import MapPin from "./MapPin";
import NextArrow from "./NextArrow";
import Pencil from "./Pencil";
import Percent from "./Percent";
import Plan from "./Plan";
import PlanOutline from "./PlanOutline";
import Plus from "./Plus";
import Shield from "./Shield";
import Ship from "./Ship";
import ShipOutline from "./ShipOutline";
import TIme from "./TIme";
import Trash from "./Trash";
import User from "./User";
import Warning from "./Warning";

const icons: any = {
  Arrow: Arrow,
  Apple: Apple,
  Google: Google,
  Mail: Mail,
  BackArrow: BackArrow,
  CloseEye: CloseEye,
  Eye: Eye,
  NextArrow: NextArrow,
  Cart: Cart,
  Bell: Bell,
  Box: Box,
  Dollar: Dollar,
  Time: TIme,
  Shield: Shield,
  Door: Door,
  Calendar: CalendarCheck,
  Copy: Copy,
  User: User,
  Pencil: Pencil,
  Trash: Trash,
  Info: Info,
  Check: Check,
  Plan: Plan,
  Ship: Ship,
  Percent: Percent,
  PlanOutline: PlanOutline,
  ShipOutline: ShipOutline,
  MapPin: MapPin,
  Plus: Plus,
  Warning: Warning,
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
