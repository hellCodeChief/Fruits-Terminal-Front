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
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
    >
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
