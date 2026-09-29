"use client";
import React from "react";
import { Button, Modal } from "antd";
import UserRoleForm from "./user-form";

const UserRoleModal = ({
  open,
  setOpen,
  editUserData,
  allRoles,
  refetchUsers,
}: any) => {
  const handleOk = () => {
    const form = document.getElementById(
      "assignUserRoleForm"
    ) as HTMLFormElement;
    form?.requestSubmit();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={`اختصاص نقش به ${editUserData?.name || "کاربر"}`}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={false} // حالا loading نداریم چون داده از قبل آماده است
    >
      {editUserData ? (
        <UserRoleForm
          editUserData={editUserData}
          allRoles={allRoles}
          refetchUsers={refetchUsers}
        />
      ) : (
        <div className="text-center p-4">اطلاعات کاربر موجود نیست</div>
      )}
    </Modal>
  );
};

export default UserRoleModal;
