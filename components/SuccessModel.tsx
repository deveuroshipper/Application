import React from "react";
import { Modal, View } from "react-native";

const SuccessModel = ({ body, show, onclose }: any) => {
  return (
    <Modal
      backdropColor={"transparent"}
      onRequestClose={onclose}
      visible={show }
      className="bg-black/10 flex justify-center items-center"
    >
      <View className="flex-1 h-full w-full">{body}</View>
    </Modal>
  );
};

export default SuccessModel;
