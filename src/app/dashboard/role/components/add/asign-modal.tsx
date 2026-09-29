"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import AddRoleForm from "./asign-form";
// import { getRoleClient } from "@/components/utils/actionsClient";

const AddRoleModal = ({
  open,
  setOpen,
  refetchRoles,
  isEdit,
  editRoleData,
  time,
  allPermissions,
}: any) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (isEdit && editRoleData?.id) {
        setLoading(true);
        // const result = await getRoleClient(editRoleData.id);
        // setEditData(result);
        setLoading(false);
      } else {
        setEditData(null);
        setLoading(false);
      }
    };

    fetchRole();
  }, [time]);

  const handleOk = () => {
    const form = document.getElementById("addRoleForm") as HTMLFormElement;
    form?.requestSubmit();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={isEdit ? "ویرایش نقش" : "افزودن نقش جدید"}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      {loading ? (
        <div className="text-center p-4">در حال بارگذاری نقش...</div>
      ) : (
        <AddRoleForm
          isEdit={isEdit}
          editRoleData={editData}
          allPermissions={allPermissions}
          refetchRoles={refetchRoles}
        />
      )}
    </Modal>
  );
};

export default AddRoleModal;
