"use client";
import React, { useState } from "react";
import { Button, Modal } from "antd";
import AddVariantForm from "./variant-form";

const AddVariantModal = ({
  open2,
  setOpen2,
  productID,
  propertyOfProduct,
  refetchProduct,
  onSuccess,
  productSlug,
  variantIsEdit,
  editProductData,
  time,
}: any) => {
  // const [open, setOpen] = useState(open2);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);

    const form = document.getElementById("addVariantForm") as HTMLFormElement;
    form?.requestSubmit();
    setConfirmLoading(false);
    setOpen2(false);

    // setTimeout(() => {
    //   setOpen(false);
    //   setConfirmLoading(false);
    // }, 2000);
  };

  const handleCancel = () => {
    setOpen2(false);
  };

  return (
    <>
      <Modal
        title="اضافه کردن واریانت"
        open={open2}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={{
          xs: "90%",
          sm: "90%",
          md: "90%",
          lg: "90%",
          xl: "90%",
          xxl: "90%",
        }}
      >
        <AddVariantForm
          productID={productID}
          propertyOfProduct={propertyOfProduct}
          onSuccess={onSuccess}
          refetchProduct={refetchProduct}
          productSlug={productSlug}
          variantIsEdit={variantIsEdit}
          editProductData={editProductData}
          time={time}
        />
      </Modal>
    </>
  );
};

export default AddVariantModal;
