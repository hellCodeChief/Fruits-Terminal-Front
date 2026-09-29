"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import AddPropertyForm from "./property-form";
import PropertyValueModal from "./property-value-modal";
import { getPropertyClient } from "@/components/utils/actionsClient";

const AddPropertyModal = ({
  allProperties,
  refetchProp,
  open,
  setOpen,
  isEdit,
  editPropertyData,
  time,
}: any) => {
  const [open2, setOpen2] = useState(false);
  const [propertyID, setPropertyID] = useState<any | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editData, setEditData] = useState<any | null>([]);

  useEffect(() => {
    if (editPropertyData) {
      setEditData(editPropertyData);
      setPropertyID(editPropertyData.id);
    } else {
      setPropertyID(null);
      setEditData(null);
    }
  }, [time]);

  const showModal2 = () => {
    setOpen2(true);
  };

  const onSuccess = async (id: string) => {
    setPropertyID(id);
    const propData = await getPropertyClient(id);

    setEditData(propData);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    const form = document.getElementById("addPropertyForm") as HTMLFormElement;
    form?.requestSubmit();
    setConfirmLoading(false);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <AddPropertyForm
          allProperties={allProperties}
          refetchProp={refetchProp}
          onSuccess={onSuccess}
          isEdit={isEdit}
          editPropertyData={editData}
          time={time}
        />
        {/* Show property values */}
        <div className="flex flex-wrap">
          {editData?.propertyValues &&
            editData?.propertyValues.map((propValue: any, index: any) => {
              return (
                <div className="w-1/2 flex flex-wrap p-3 border" key={index}>
                  <span className="w-1/2">id</span>
                  <span className="w-1/2">{propValue.id}</span>
                  <span className="w-1/2">نام اینگلیسی</span>
                  <span className="w-1/2">{propValue.Evalue}</span>
                  <span className="w-1/2">نام فارسی</span>
                  <span className="w-1/2">{propValue.Fvalue}</span>
                  <span className="w-1/2">property id</span>
                  <span className="w-1/2">{propValue.propertyId}</span>
                </div>
              );
            })}
        </div>
        <Button
          type="primary"
          disabled={isEdit ? false : !propertyID}
          onClick={showModal2}
        >
          اضافه کردن مقادیر ویژگی
        </Button>
        <PropertyValueModal
          time={time}
          open2={open2}
          setOpen2={setOpen2}
          propertyID={propertyID}
          refetchProp={refetchProp}
          onSuccess={onSuccess}
        />
      </Modal>
    </>
  );
};

export default AddPropertyModal;
