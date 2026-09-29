"use client";

import { Modal } from "antd";
import AddCategoryForm from "./category-form";

const AddCategoryModal = ({
  open,
  setOpen,
  allCategories,
  refetchCat,
  isEdit = null,
  editCategoryData,
  time,
}: any) => {
  const handleCancel = () => setOpen(false);
  const handleOk = () => {
    const form = document.getElementById("addCategoryForm") as HTMLFormElement;
    form?.requestSubmit();
    // setOpen(false);
  };

  return (
    <Modal
      title={isEdit ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <AddCategoryForm
        setOpen={setOpen}
        allCategories={allCategories}
        refetchCat={refetchCat}
        isEdit={isEdit}
        editCategoryData={editCategoryData}
        time={time}
      />
    </Modal>
  );
};

export default AddCategoryModal;
