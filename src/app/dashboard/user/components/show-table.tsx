"use client";

import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import {
  getAllUsersClient,
  // updateUserRolesClient,
} from "@/components/utils/actionsClient";
import UserRoleModal from "./add/user-modal";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

interface Props {
  allRoles: Role[];
  userPermission: any[];
  allUsers: User[];
  isGodUser: boolean;
}

export default function UserRoleShowTable({
  allRoles,
  allUsers,
  userPermission,
  isGodUser,
}: Props) {
  const [data, setData] = useState<User[]>(allUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [time, setTime] = useState(Date.now());

  const hasPermission = (permName: string) =>
    isGodUser || userPermission.some((p) => p.name === permName);

  const refetchUsers = async () => {
    try {
      const res = await getAllUsersClient();
      setData(res || []);
    } catch (err) {
      message.error("خطا در دریافت لیست کاربران");
    }
  };

  const handleAssignClick = (user: User) => {
    setEditUserData(user);
    setModalOpen(true);
    setTime(Date.now());
  };

  const columns: TableProps<User>["columns"] = [
    {
      title: "نام",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "نام خانوادگی",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "همراه",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "ایمیل",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "نقش‌ها",
      key: "roles",
      render: (_, record) => record.roles.map((r) => r.name).join("، "),
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_, record) => (
        <Button
          onClick={() => handleAssignClick(record)}
          disabled={!hasPermission("user:assign-role")}
        >
          اختصاص نقش
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="overflow-auto">
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <UserRoleModal
        open={modalOpen}
        setOpen={setModalOpen}
        editUserData={editUserData}
        allRoles={allRoles}
        time={time}
        refetchUsers={refetchUsers}
      />
    </>
  );
}
