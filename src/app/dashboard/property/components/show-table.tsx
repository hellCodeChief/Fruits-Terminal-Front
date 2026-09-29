"use client";

import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import { getAllPropertyClient } from "@/components/utils/actionsClient";
import AddPropertyModal from "./add/property-modal";

interface PropertyValue {
  id: number;
  Evalue: string;
  Fvalue: string;
  propertyId: number;
}

interface DataType {
  id: number;
  Ename: string;
  Fname: string;
  example: string | null;
  type: string;
  propertyValues: PropertyValue[];
}

export default function PropertyShowTable({
  dataSource,
  isGodUser,
  userPermission,
}: any) {
  const [data, setData] = useState(dataSource);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editPropertyData, setEditPropertyData] = useState<DataType | null>(
    null,
  );
  const [time, setTime] = useState(Date.now());

  const hasPermission = (permName: string) =>
    isGodUser || userPermission.some((p: any) => p.name === permName);

  const refetchProp = async () => {
    const res = await getAllPropertyClient();
    setData(res || []);
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setEditPropertyData(null);
    setModalOpen(true);
    setTime(Date.now());
  };

  const handleEditClick = (property: DataType) => {
    setIsEdit(true);
    setEditPropertyData(property);
    setModalOpen(true);
    setTime(Date.now());
  };

  const handleDeleteProperty = async (id: number) => {
    try {
      // await softDeletePropertyClient(id);
      message.success("ویژگی با موفقیت حذف شد");
      await refetchProp();
    } catch (error) {
      message.error("خطا در حذف ویژگی");
      console.error(error);
    }
  };

  const handleHardDeleteProperty = async (id: number) => {
    try {
      // await hardDeletePropertyClient(id);
      message.success("ویژگی به‌صورت دائمی حذف شد");
      await refetchProp();
    } catch (error) {
      message.error("خطا در حذف دائمی ویژگی");
      console.error(error);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "English Name",
      dataIndex: "Ename",
      key: "Ename",
    },
    {
      title: "Farsi Name",
      dataIndex: "Fname",
      key: "Fname",
    },
    {
      title: "Example",
      dataIndex: "example",
      key: "example",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleEditClick(record)}
            disabled={!hasPermission("property:update")}
          >
            Edit
          </Button>
          <Popconfirm
            title="آیا از حذف این ویژگی مطمئن هستید؟"
            onConfirm={() => handleDeleteProperty(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button disabled={!hasPermission("property:delete")}>Delete</Button>
          </Popconfirm>
          <Popconfirm
            title="آیا از حذف دائمی این ویژگی مطمئن هستید؟ عملیات غیرقابل بازگشت است!"
            onConfirm={() => handleHardDeleteProperty(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button danger disabled={!hasPermission("property:delete")}>
              HARD Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const expandedRowRender = (record: DataType) => (
    <ul className="flex flex-wrap">
      {record.propertyValues.map((value: PropertyValue) => (
        <li key={value.id} className="w-1/3">
          <b>{value.id}:</b> {value.Evalue} / {value.Fvalue}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Add Property Modal Trigger */}
      <Button
        type="primary"
        onClick={handleAddClick}
        disabled={!hasPermission("property:create")}
      >
        افزودن ویژگی
      </Button>

      <AddPropertyModal
        allProperties={dataSource}
        refetchProp={refetchProp}
        open={modalOpen}
        setOpen={setModalOpen}
        isEdit={isEdit}
        editPropertyData={editPropertyData}
        time={time}
      />
      <div className="overflow-auto">
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.propertyValues.length > 0,
          }}
        />
      </div>
    </>
  );
}
