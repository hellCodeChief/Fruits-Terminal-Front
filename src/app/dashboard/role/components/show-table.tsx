"use client";

import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import {
  // getAllRolesClient,
  // softDeleteRoleClient,
  // hardDeleteRoleClient,
  getAllroleClient,
} from "@/components/utils/actionsClient";
import RoleModal from "./add/asign-modal";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

interface Props {
  allPermissions: Permission[];
  userPermission: Permission[];
  allRoles: Role[];
  isGodUser: boolean;
}

export default function RoleShowTable({
  allPermissions,
  allRoles,
  userPermission,
  isGodUser,
}: Props) {
  const [data, setData] = useState<Role[]>(allRoles);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editRoleData, setEditRoleData] = useState<Role | null>(null);
  const [time, setTime] = useState(Date.now());

  const hasPermission = (permName: string) =>
    isGodUser || userPermission.some((p) => p.name === permName);

  const refetchRoles = async () => {
    try {
      const res = await getAllroleClient();
      setData(res || []);
    } catch (err) {
      message.error("خطا در دریافت لیست نقش‌ها");
    }
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setEditRoleData(null);
    setModalOpen(true);
    setTime(Date.now());
  };

  const handleEditClick = (role: Role) => {
    setIsEdit(true);
    setEditRoleData(role);
    setModalOpen(true);
    setTime(Date.now());
  };

  const handleSoftDelete = async (id: string) => {
    try {
      // await softDeleteRoleClient(id);
      message.success("نقش با موفقیت حذف شد");
      await refetchRoles();
    } catch (err) {
      message.error("خطا در حذف نقش");
    }
  };

  const handleHardDelete = async (id: string) => {
    try {
      // await hardDeleteRoleClient(id);
      message.success("نقش به صورت دائمی حذف شد");
      await refetchRoles();
    } catch (err) {
      message.error("خطا در حذف دائمی نقش");
    }
  };

  const columns: TableProps<Role>["columns"] = [
    {
      title: "نام نقش",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "مجوزها",
      key: "permissions",
      render: (_, record) => record.permissions.map((p) => p.name).join("، "),
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleEditClick(record)}
            disabled={!hasPermission("role:update")}
          >
            ویرایش
          </Button>
          <Popconfirm
            title="آیا از حذف این نقش مطمئن هستید؟"
            onConfirm={() => handleSoftDelete(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button disabled={!hasPermission("role:delete")}>حذف</Button>
          </Popconfirm>
          <Popconfirm
            title="آیا از حذف دائمی این نقش مطمئن هستید؟ این عملیات قابل بازگشت نیست!"
            onConfirm={() => handleHardDelete(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button danger disabled={!hasPermission("role:delete")}>
              حذف دائمی
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        className="mb-4"
        onClick={handleAddClick}
        disabled={!hasPermission("role:create")}
      >
        ایجاد نقش جدید
      </Button>

      <RoleModal
        open={modalOpen}
        setOpen={setModalOpen}
        isEdit={isEdit}
        editRoleData={editRoleData}
        allPermissions={allPermissions}
        time={time}
        refetchRoles={refetchRoles}
      />
      <div className="overflow-auto">
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
}
