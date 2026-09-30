"use client";

import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import {
  getAllProductClient,
  softDeleteProductClient,
  hardDeleteProductClient,
} from "@/components/utils/actionsClient";
import AddProductModal from "./add/product-modal";

interface DataType {
  id: number;
  isParent: boolean;
  desc: string;
  slug: string;
  displayName: string;
  isActive: boolean;
  childCategories: any[];
  parentCategories: any[];
  files?: any[];
}

interface ProductShowTableProps {
  dataSource: DataType[];
  allCategories: any[];
  userPermission: any[];
  isGodUser: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProductShowTable({
  dataSource,
  allCategories,
  userPermission,
  isGodUser,
}: ProductShowTableProps) {
  const [data, setData] = useState(Array.isArray(dataSource) ? dataSource : []);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editProductData, setEditProductData] = useState<any>(null);
  const [time, setTime] = useState(Date.now());

  const refetchProduct = async () => {
    const res = await getAllProductClient();
    setData(Array.isArray(res) ? res : []);
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setEditProductData(null);
    setModalOpen(true);
    setTime(Date.now());
  };

  const handleEditClick = (record: any) => {
    setIsEdit(true);
    setEditProductData(record);
    setTime(Date.now());
    setModalOpen(true);
  };

  const handleSoftDeleteProduct = async (_id: number) => {
    try {
      await softDeleteProductClient(_id);
      message.success("محصول با موفقیت حذف شد");
      const updated = await getAllProductClient();
      setData(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error("خطا در حذف نرم:", error);
    }
  };

  const handleHardDeleteProduct = async (_id: number) => {
    try {
      await hardDeleteProductClient(_id);
      message.success("محصول به صورت دائم حذف شد");
      const updated = await getAllProductClient();
      setData(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error("خطا در حذف سخت:", error);
    }
  };

  const hasPermission = (permName: string) =>
    isGodUser || userPermission.some((p: any) => p.name === permName);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "توضیحات",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "تصویر",
      dataIndex: "files",
      key: "image",
      render: (files: any[]) => {
        const file = files?.[0];
        return file ? (
          <img
            src={`${BASE_URL}/files/${file.id}/product`}
            alt="product"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          "بدون تصویر"
        );
      },
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "وضعیت",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <span style={{ color: "green" }}>🟢 فعال</span>
        ) : (
          <span style={{ color: "red" }}>🔴 غیرفعال</span>
        ),
    },
    {
      title: "عملیات",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEditClick(record)}>ویرایش</Button>

          <Popconfirm
            title="آیا از حذف مطمئن هستید؟"
            onConfirm={() => handleSoftDeleteProduct(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button disabled={!hasPermission("product:soft-delete")}>
              حذف نرم
            </Button>
          </Popconfirm>

          <Popconfirm
            title="آیا مطمئنید؟ این حذف دائمی است!"
            onConfirm={() => handleHardDeleteProduct(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button danger disabled={!hasPermission("product:hard-delete")}>
              حذف سخت
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
        onClick={handleAddClick}
        disabled={!hasPermission("product:create")}
      >
        افزودن محصول
      </Button>

      <AddProductModal
        allProducts={dataSource}
        allCategories={allCategories}
        refetchProduct={refetchProduct}
        userPermission={userPermission}
        open={modalOpen}
        setOpen={setModalOpen}
        isEdit={isEdit}
        editProductData={editProductData}
        time={time}
      />
      <div className="overflow-auto">
        <Table dataSource={data} columns={columns} rowKey="id" />
      </div>
    </>
  );
}
