"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import AddPropertyValueForm from "./property-value-form";

const PropertyValueModal = ({
  open2,
  setOpen2,
  time,
  propertyID,
  refetchProp,
  onSuccess,
}: any) => {
  // const [open, setOpen] = useState(open2);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [localId, setLocalId] = useState(null);

  useEffect(() => {
    setLocalId(propertyID);
  }, [propertyID]);

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
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
      >
        <AddPropertyValueForm
          propertyID={localId}
          time={time}
          refetchProp={refetchProp}
          onSuccess={onSuccess}
        />
      </Modal>
    </>
  );
};

export default PropertyValueModal;
