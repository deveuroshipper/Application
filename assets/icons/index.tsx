import React from "react";
import Apple from "./Apple";
import Arrow from "./Arrow";
import BackArrow from "./BackArrow";
import Bell from "./Bell";
import Box from "./Box";
import BoxArrowUp from "./BoxArrowUp";
import CalendarCheck from "./CalendarCheck";
import Cart from "./Cart";
import ChatTeardrop from "./ChatTeardrop";
import Check from "./Check";
import CheckCircle from "./CheckCircle";
import CloseEye from "./CloseEye";
import Copy from "./Copy";
import Dollar from "./Dollar";
import Door from "./Door";
import Eye from "./Eye";
import Google from "./Google";
import Info from "./Info";
import Logout from "./Logout";
import Mail from "./Mail";
import MapPin from "./MapPin";
import NextArrow from "./NextArrow";
import PaperPlane from "./PaperPlane";
import Pencil from "./Pencil";
import Percent from "./Percent";
import Plan from "./Plan";
import PlanOutline from "./PlanOutline";
import Plus from "./Plus";
import ProfileCard from "./ProfileCard";
import Shield from "./Shield";
import Ship from "./Ship";
import ShipOutline from "./ShipOutline";
import Support from "./Support";
import Sync from "./Sync";
import TIme from "./TIme";
import Trash from "./Trash";
import User from "./User";
import Warehouse from "./Warehouse";
import Warning from "./Warning";
import WarningDiamond from "./WarningDiamond";

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
  Warehouse: Warehouse,
  ProfileCard: ProfileCard,
  Support: Support,
  Logout: Logout,
  ChatTeardrop: ChatTeardrop,
  Sync: Sync,
  WarningDiamond: WarningDiamond,
  CheckCircle: CheckCircle,
  PaperPlane: PaperPlane,
  BoxArrowUp: BoxArrowUp,
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
