import { SHIPMENT_TYPE } from "@/constants/enums";
import { create } from "zustand";

interface AddressState {
  route: string | null;
  shipmentType: SHIPMENT_TYPE | null;
  date: Date | String | null;
  time: string | null;
  pickupAddress: any | null;
  deliverAddress: any | null;
  

  setRoute: (route: string | null) => void;
  setShipmentType: (type: SHIPMENT_TYPE | null) => void;
  setDate: (date: Date | String | null) => void;
  setTime: (time: string | null) => void;
  setPickupAddress: (address: any | null) => void;
  setDeliverAddress: (address: any | null) => void;
}

export const useAddressStore = create<AddressState>()((set) => ({
  route: null,
  shipmentType: null,
  date: null,
  time: null,
  pickupAddress: null,
  deliverAddress: null,

  setRoute: (route) => {
    set({ route });
  },

  setShipmentType: (shipmentType) => {
    set({ shipmentType });
  },

  setDate: (date) => {
    set({ date });
  },

  setTime: (time) => {
    set({ time });
  },

  setPickupAddress: (pickupAddress) => {
    set({ pickupAddress });
  },

  setDeliverAddress: (deliverAddress) => {
    set({ deliverAddress });
  },
}));
