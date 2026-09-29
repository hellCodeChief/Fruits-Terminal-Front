"use client";
import React from "react";
import { Modal } from "antd";
import AddProductForm from "./product-form";

const AddProductModalApp = ({
  refetchProduct,
  open,
  setOpen,
  editProductData,
  isEdit,
  time,
}: any) => {
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={isEdit ? "ویرایش محصول" : "افزودن محصول"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <AddProductForm
        isEdit={isEdit}
        editProductData={editProductData}
        refetchProduct={refetchProduct}
        onSuccess={handleCancel}
        time={time}
      />
    </Modal>
  );
};

export default AddProductModalApp;
