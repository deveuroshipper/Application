import React from "react";
import { Modal, View } from "react-native";

const SuccessModel = ({ body, show, onclose }: any) => {
  return (
    <Modal
      transparent
      onRequestClose={onclose}
      visible={show}
      className="bg-black/10 flex justify-center items-center"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        className="flex-1 h-full w-full"
      >
        {body}
      </View>
    </Modal>
  );
};

export default SuccessModel;
