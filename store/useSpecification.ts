import { SHIPMENT_ROUTE } from "@/constants/enums";
import { create } from "zustand";

interface SpecificationState {
  category: string | null;
  subcategory: string | null;
  box: Date | string | null;
  approxWeight: Date | string | null;
  approxH: string | null;
  approxW: string | null;
  approxL: string | null;
  info: string | null;
  typeOfShipment: SHIPMENT_ROUTE | null;

  setCategory: (category: string | null) => void;
  setSubcategory: (subcategory: string | null) => void;
  setBox: (box: Date | string | null) => void;
  setApproxWeight: (approxWeight: Date | string | null) => void;
  setApproxH: (height: string | null) => void;
  setApproxW: (width: string | null) => void;
  setApproxL: (length: string | null) => void;
  setInfo: (info: string | null) => void;
  setTypeOfShipment: (type: SHIPMENT_ROUTE | null) => void;
}

export const useSpecificationStore = create<SpecificationState>()((set) => ({
  category: null,
  subcategory: null,
  box: null,
  approxWeight: null,
  approxH: null,
  approxW: null,
  approxL: null,
  info: null,
  typeOfShipment: null,

  setCategory: (category) => {
    set({ category });
  },

  setSubcategory: (subcategory) => {
    set({ subcategory });
  },

  setBox: (box) => {
    set({ box });
  },

  setApproxWeight: (approxWeight) => {
    set({ approxWeight });
  },

  setApproxH: (approxH) => {
    set({ approxH });
  },

  setApproxW: (approxW) => {
    set({ approxW });
  },

  setApproxL: (approxL) => {
    set({ approxL });
  },

  setInfo: (info) => {
    set({ info });
  },

  setTypeOfShipment: (typeOfShipment) => {
    set({ typeOfShipment });
  },
}));
