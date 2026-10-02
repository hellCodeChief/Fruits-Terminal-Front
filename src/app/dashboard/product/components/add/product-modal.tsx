"use client";

import { Modal } from "antd";
import SimpleAdd from "../simple-add";

const AddProductModalApp = ({
  allCategories,
  products,
  refetchProduct,
  open,
  setOpen,
  editProductData,
  isEdit,
}: any) => {
  return (
    <Modal
      title={isEdit ? "ویرایش محصول" : "افزودن محصول"}
      open={open}
      centered
      width="calc(100vw - 2rem)"
      style={{ maxWidth: 520 }}
      styles={{
        body: { maxHeight: "calc(100dvh - 9rem)", overflowY: "auto" },
      }}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
    >
      {/* ✅ کارت وسط صفحه؛ اگر فرم بلند است داخل خودش اسکرول می‌شود */}
      {/* ✅ ویرایش همان فرم افزودن ساده است، نه فرم محدود قبلی */}
      <SimpleAdd
        categories={allCategories}
        products={products}
        editing={isEdit ? editProductData : null}
        onSaved={() => {
          refetchProduct();
          setOpen(false);
        }}
      />
    </Modal>
  );
};

export default AddProductModalApp;
