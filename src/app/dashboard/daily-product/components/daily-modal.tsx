"use client";

import { Modal } from "antd";
import SimpleAdd from "../../product/components/simple-add";

const DailyProductModal = ({
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
      title={isEdit ? "ویرایش حجره" : "افزودن حجره"}
      open={open}
      centered
      width="calc(100% - 2rem)"
      style={{ maxWidth: 520 }}
      styles={{
        body: { maxHeight: "calc(100dvh - 9rem)", overflowY: "auto" },
      }}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
    >
      {/* ✅ این فرم فقط dailyProduct را می‌نویسد */}
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

export default DailyProductModal;
