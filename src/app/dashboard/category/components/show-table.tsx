"use client";

import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import {
  softDeleteCategoriesClient,
  getAllCategoriesClient,
  hardDeleteCategoriesClient,
} from "@/components/utils/actionsClient";
import AddCategoryModal from "./add/category-modal";

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

interface Permission {
  name: string;
  description?: string;
}

interface CategoryShowTableProps {
  dataSource: DataType[];
  userPermission: Permission[];
  isGodUser: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CategoryShowTable({
  dataSource,
  userPermission,
  isGodUser,
}: CategoryShowTableProps) {
  const [data, setData] = useState(dataSource);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<DataType | null>(
    null,
  );
  const [time, setTime] = useState(Date.now());

  // چک کردن دسترسی
  const hasPermission = (permName: string) =>
    isGodUser || userPermission.some((p) => p.name === permName);

  const refetchCat = async () => {
    try {
      const res = await getAllCategoriesClient();
      setData(res);
    } catch (error: any) {
      message.error("خطا در دریافت دسته‌بندی‌ها", error);
    }
  };

  const handleAddClick = () => {
    setTime(Date.now());
    setIsEdit(false);
    setEditCategoryData(null);
    setModalOpen(true);
  };

  const handleEditClick = (_category: DataType) => {
    setTime(Date.now());
    setIsEdit(true);
    setEditCategoryData(_category);
    setModalOpen(true);
  };

  const handleDeleteCategory = async (_id: number) => {
    try {
      await softDeleteCategoriesClient(_id);
      message.success("حذف نرم دسته‌بندی با موفقیت انجام شد");
      await refetchCat();
    } catch (error) {
      message.error("خطا در حذف دسته‌بندی");
      console.log(error);
    }
  };

  const handleHardDeleteCategory = async (_id: number) => {
    try {
      await hardDeleteCategoriesClient(_id);
      message.success("حذف دائمی دسته‌بندی با موفقیت انجام شد");
      await refetchCat();
    } catch (error) {
      message.error("خطا در حذف دائمی دسته‌بندی");
      console.log(error);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Is Parent",
      dataIndex: "isParent",
      key: "isParent",
      render: (isParent) => (isParent ? "✅ Yes" : "❌ No"),
    },
    {
      title: "Description",
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
            src={`${BASE_URL}/files/${file.id}/category`}
            alt="category"
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
      title: "Display Name",
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <span style={{ color: "green" }}>🟢 Active</span>
        ) : (
          <span style={{ color: "red" }}>🔴 Inactive</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleEditClick(record)}
            disabled={!hasPermission("category:update")}
          >
            Edit
          </Button>
          <Popconfirm
            title="آیا از حذف نرم این دسته‌بندی مطمئن هستید؟"
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button disabled={!hasPermission("category:soft-delete")}>
              Delete
            </Button>
          </Popconfirm>
          <Popconfirm
            title="آیا از حذف دائمی این دسته‌بندی مطمئن هستید؟"
            onConfirm={() => handleHardDeleteCategory(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button danger disabled={!hasPermission("category:hard-delete")}>
              HARD Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const expandedRowRender = (record: DataType) => {
    return (
      <div className="flex gap-6">
        <div className="flex-grow">
          <h4>این دسته‌بندی والد دسته‌های زیر است:</h4>
          <ul>
            {record.parentCategories.map(
              (parentCategory, index) =>
                record.id !== parentCategory.id && (
                  <li key={index}>
                    <b>id:</b> {parentCategory.childId} | <b>depth:</b>{" "}
                    {parentCategory.depth} | <b>displayName:</b>{" "}
                    {parentCategory.childCategory
                      ? parentCategory.childCategory.displayName
                      : "بدون نام"}
                  </li>
                ),
            )}
          </ul>
        </div>
        <div className="flex-grow">
          <h4>این دسته‌بندی فرزند دسته‌های زیر است:</h4>
          <ul>
            {record.childCategories.map(
              (childCategory, index) =>
                record.id !== childCategory.id && (
                  <li key={index}>
                    <b>id:</b> {childCategory.parentId} | <b>depth:</b>{" "}
                    {childCategory.depth} | <b>displayName:</b>{" "}
                    {childCategory.parentCategory
                      ? childCategory.parentCategory.displayName
                      : "بدون نام"}
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <Button
        type="primary"
        onClick={handleAddClick}
        disabled={!hasPermission("category:create")}
      >
        افزودن دسته‌بندی
      </Button>
      <AddCategoryModal
        allCategories={data}
        refetchCat={refetchCat}
        open={modalOpen}
        setOpen={setModalOpen}
        isEdit={isEdit}
        editCategoryData={editCategoryData}
        time={time}
        userPermission={userPermission} // اگر داخل مودال نیاز داری به دسترسی‌ها
        isGodUser={isGodUser}
      />
      <div className="overflow-auto">
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          expandable={{
            expandedRowRender,
            rowExpandable: (record) =>
              record.childCategories.length > 0 ||
              record.parentCategories.length > 0,
          }}
        />
      </div>
    </>
  );
}
