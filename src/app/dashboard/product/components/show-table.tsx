"use client";

import { Button, Card, message, Modal, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
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
  createdAt?: string;
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

// ✅ ترتیب با تاریخ تازه‌ترین تنوع؛ نه آیدی و نه تاریخ خود محصول
function variantSortTime(record: DataType) {
  const createdAt = latestVariant(record)?.createdAt;
  const variantTime = Date.parse(createdAt || "");
  if (createdAt && !Number.isNaN(variantTime)) return variantTime;
  return 0;
}

function newestFirst(list: DataType[]) {
  return [...(Array.isArray(list) ? list : [])].sort(
    (a, b) => variantSortTime(b) - variantSortTime(a)
  );
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

// ✅ توضیح اگر از یک ردیف بلندتر باشد، بقیه در مودال
function DescriptionRow({ text }: { text: string }) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    setOverflow(line.scrollWidth > line.clientWidth + 1);
  }, [text]);

  return (
    <>
      <div className="mt-1 flex min-w-0 items-center gap-2">
        <span ref={lineRef} className="min-w-0 flex-1 truncate">
          توضیحات: {text}
        </span>
        {overflow && (
          <button type="button" className="shrink-0" onClick={() => setOpen(true)}>
            بیشتر…
          </button>
        )}
      </div>
      <Modal open={open} title="توضیحات" footer={null} onCancel={() => setOpen(false)}>
        {text}
      </Modal>
    </>
  );
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
      {/* ✅ گوشی: افزودن با فاصله از لبه پایین و راست؛ روی دکمه‌های کارت نمی‌افتد */}
      <div className="fixed bottom-6 right-6 z-40 max-w-[calc(100%-3rem)] rounded bg-light-myWhite p-1 md:static md:max-w-none md:bg-transparent md:p-0">
        <Button
          type="primary"
          onClick={handleAddClick}
          disabled={!hasPermission("product:create")}
          className="whitespace-nowrap"
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
      {/* ✅ عرض کارت از صفحه بیرون نزند تا اسکرول افقی نماند */}
      <div className="mt-4 flex w-full min-w-0 max-w-full flex-col gap-3 overflow-x-hidden pb-24 md:hidden">
        {data.map((record) => {
          const src = productImage(record);
          return (
            <Card
              key={record.id}
              size="small"
              className="w-full min-w-0 max-w-full overflow-hidden"
              styles={{ body: { padding: 0 } }}
            >
              {src ? (
                <img
                  src={src}
                  alt=""
                  className="block aspect-square w-full min-w-0 max-w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full min-w-0 max-w-full items-center justify-center bg-light-myGray text-xs">
                  بدون تصویر
                </div>
              )}
              {/* ✅ دو ستون تا کارت کوتاه‌تر بماند؛ قیمت درشت است */}
              <div className="min-w-0 p-3">
                <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-1">
                  <div className="min-w-0 break-words">ID: {record.id}</div>
                  <div className="min-w-0 break-words font-bold">قیمت: {priceText(record)}</div>
                  <div className="min-w-0 truncate">Slug: {record.slug}</div>
                  <div className="min-w-0 break-words">
                    وضعیت:{" "}
                    {record.isActive ? (
                      <span style={{ color: "green" }}>🟢 فعال</span>
                    ) : (
                      <span style={{ color: "red" }}>🔴 غیرفعال</span>
                    )}
                  </div>
                </div>
                <DescriptionRow text={descriptionText(record)} />
              <div className="mt-3 flex min-w-0 flex-wrap gap-2">
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
