"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import AddProductForm from "./product-form";
import AddVariantModal from "./variant-modal";
import { findProductClient } from "@/components/utils/actionsClient";
import ShowVariant from "@/components/show-variant/show-variant";

const AddProductModalApp = ({
  allProducts,
  allCategories,
  refetchProduct,
  open,
  setOpen,
  userPermission,
  editProductData,
  isEdit,
  time,
}: any) => {
  const [open2, setOpen2] = useState(false);
  const [variantIsEdit, setVariantIsEdit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [productID, setProductID] = useState<string | null>(null);
  const [productSlug, setProductSlug] = useState<string | null>(null);
  const [currentProductData, setCurrentProductData] = useState<{
    [key: string]: any;
  } | null>(null);
  const [propertyOfProduct, setPropertyOfProduct] = useState([]);

  useEffect(() => {
    if (isEdit && editProductData) {
      setCurrentProductData(editProductData);
      setPropertyOfProduct(editProductData.properties);
      setProductID(editProductData.id);
      setProductSlug(editProductData.slug);
      setVariantIsEdit(true);
    } else {
      setCurrentProductData(null);
      setPropertyOfProduct([]);
      setProductID(null);
      setProductSlug(null);
      setVariantIsEdit(false);
    }
  }, [isEdit, editProductData, time]);

  const fetchProductData = async (id: any) => {
    return await findProductClient(id);
  };

  const onSuccess = async (_id: string, _slug: string) => {
    setProductID(_id);
    setProductSlug(_slug);
    // find registered product data
    const data = await fetchProductData(_id);

    setCurrentProductData(data);
    setPropertyOfProduct(data.properties);
  };

  const showModal2 = () => {
    if (isEdit) {
      setVariantIsEdit(true);
      setPropertyOfProduct(editProductData.properties);
    } else {
      // setProductID()
    }
    setOpen2(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title={isEdit ? "ویرایش محصول" : "افزودن محصول"}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        style={{
          height: "500px", // Set height
          maxHeight: "80vh", // Optional: Prevent modal from getting too large
        }}
      >
        <AddProductForm
          isEdit={isEdit}
          editProductData={editProductData}
          allProducts={allProducts}
          allCategories={allCategories}
          refetchProduct={refetchProduct}
          onSuccess={onSuccess}
          time={time}
        />

        {currentProductData && currentProductData?.variants?.length > 0 && (
          <ShowVariant currentProductData={currentProductData} />
        )}

        {isEdit ? (
          <Button type="primary" onClick={showModal2}>
            ویرایش واریانت
          </Button>
        ) : (
          <Button type="primary" disabled={!productID} onClick={showModal2}>
            اضافه کردن واریانت
          </Button>
        )}
        <AddVariantModal
          productID={productID}
          onSuccess={onSuccess}
          productSlug={productSlug}
          open2={open2}
          setOpen2={setOpen2}
          propertyOfProduct={propertyOfProduct}
          refetchProduct={refetchProduct}
          variantIsEdit={variantIsEdit}
          editProductData={editProductData}
          time={time}
        />
      </Modal>
    </>
  );
};

export default AddProductModalApp;
