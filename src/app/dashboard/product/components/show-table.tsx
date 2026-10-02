"use client";

import { Button, Card, message, Popconfirm, Table } from "antd";
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
    desc?: string;
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

function priceText(record: DataType) {
  const amount = storedRial(record);
  if (amount === undefined || amount === null || amount === "") return "—";
  return `${amount} ریال`;
}

function descriptionText(record: DataType) {
  return latestVariant(record)?.desc || record.desc || "";
}

// ✅ جدیدترین فایل؛ عکس تازه‌آپلودشده جای عکس قبلی را می‌گیرد
function newestFile(files?: { id: number }[]) {
  if (!files?.length) return null;
  return files.reduce((best, file) => (file.id > best.id ? file : best));
}

function productImage(record: DataType) {
  const variantFile = newestFile(latestVariant(record)?.files);
  const file = variantFile || newestFile(record.files);
  if (!file) return null;
  const usage = variantFile ? "product-variant" : "product";
  return `${BASE_URL}/files/${file.id}/${usage}`;
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
      key: "desc",
      render: (_, record) => descriptionText(record),
    },
    {
      title: "تصویر",
      key: "image",
      render: (_, record) => {
        const src = productImage(record);
        return src ? (
          <img
            src={src}
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
      render: (_, record) => priceText(record),
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
      {/* ✅ گوشی: افزودن گوشه پایین راست می‌ماند؛ دسکتاپ سر جایش بالای جدول */}
      <div className="fixed bottom-4 right-4 z-40 md:static">
        <Button
          type="primary"
          onClick={handleAddClick}
          disabled={!hasPermission("product:create")}
        >
          افزودن محصول
        </Button>
      </div>

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
      {/* ✅ گوشی: عکس تمام‌عرض بالا، متن و دکمه‌ها زیرش؛ کارت کوتاه است تا بعدی دیده شود */}
      <div className="mt-4 flex flex-col gap-3 pb-16 md:hidden">
        {data.map((record) => {
          const src = productImage(record);
          return (
            <Card key={record.id} size="small" styles={{ body: { padding: 0 } }}>
              {src ? (
                <img src={src} alt="" className="block h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 w-full items-center justify-center bg-light-myGray text-xs">
                  بدون تصویر
                </div>
              )}
              <div className="p-3">
                <div>ID: {record.id}</div>
                <div>توضیحات: {descriptionText(record)}</div>
                <div className="break-words">Slug: {record.slug}</div>
                <div>قیمت: {priceText(record)}</div>
                <div>
                  وضعیت:{" "}
                  {record.isActive ? (
                    <span style={{ color: "green" }}>🟢 فعال</span>
                  ) : (
                    <span style={{ color: "red" }}>🔴 غیرفعال</span>
                  )}
                </div>
              <div className="mt-3 flex flex-wrap gap-2">
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
              </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="hidden overflow-auto md:block">
        <Table dataSource={data} columns={columns} rowKey="id" />
      </div>
    </>
  );
}
