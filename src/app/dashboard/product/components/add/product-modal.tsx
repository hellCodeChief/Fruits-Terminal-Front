"use client";

import { Modal } from "antd";
import AddProductForm from "./product-form";
import SimpleAdd from "../simple-add";

const AddProductModalApp = ({
  allCategories,
  products,
  refetchProduct,
  open,
  setOpen,
  editProductData,
  isEdit,
  time,
}: any) => {
  return (
    <Modal
      title={isEdit ? "ویرایش محصول" : "افزودن محصول"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
    >
      {isEdit ? (
        <AddProductForm
          isEdit
          editProductData={editProductData}
          allCategories={allCategories}
          refetchProduct={refetchProduct}
          time={time}
        />
      ) : (
        <SimpleAdd
          categories={allCategories}
          products={products}
          onSaved={() => {
            refetchProduct();
            setOpen(false);
          }}
        />
      )}
    </Modal>
  );
};

export default AddProductModalApp;
