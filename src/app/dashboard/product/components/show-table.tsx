"use client";

import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
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
  files?: { id: number }[];
  variants?: {
    id?: number;
    price?: number | string;
    createdAt?: string;
    files?: { id: number }[];
  }[];
}

// ✅ جدیدترین اول؛ ترتیب API از قدیم به جدید است
function newestFirst<T>(list: T[]) {
  return Array.isArray(list) ? [...list].reverse() : [];
}

// ✅ تازه‌ترین تنوع با تاریخ؛ قیمت و عکس همان تنوع
function latestVariant(record: DataType) {
  const variants = Array.isArray(record.variants) ? record.variants : [];
  return variants.reduce<(typeof variants)[number] | undefined>((latest, item) => {
    if (!latest) return item;
    const latestTime = Date.parse(latest.createdAt || "") || latest.id || 0;
    const itemTime = Date.parse(item.createdAt || "") || item.id || 0;
    return itemTime >= latestTime ? item : latest;
  }, undefined);
}

function storedRial(record: DataType) {
  return latestVariant(record)?.price;
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
  const [data, setData] = useState(newestFirst(dataSource));

  useEffect(() => {
    setData(newestFirst(dataSource));
  }, [dataSource]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editProductData, setEditProductData] = useState<any>(null);
  const [time, setTime] = useState(Date.now());

  const refetchProduct = async () => {
    const res = await getAllProductClient();
    setData(newestFirst(res));
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
      setData(newestFirst(updated));
    } catch (error) {
      console.error("خطا در حذف نرم:", error);
    }
  };

  const handleHardDeleteProduct = async (_id: number) => {
    try {
      await hardDeleteProductClient(_id);
      message.success("محصول به صورت دائم حذف شد");
      const updated = await getAllProductClient();
      setData(newestFirst(updated));
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
      key: "image",
      render: (_, record) => {
        const variantFile = latestVariant(record)?.files?.[0];
        const file = variantFile || record.files?.[0];
        const usage = variantFile ? "product-variant" : "product";
        return file ? (
          <img
            src={`${BASE_URL}/files/${file.id}/${usage}`}
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
      title: "قیمت",
      key: "price",
      render: (_, record) => {
        const amount = storedRial(record);
        if (amount === undefined || amount === null || amount === "") return "—";
        return `${amount} ریال`;
      },
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
        products={data}
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
