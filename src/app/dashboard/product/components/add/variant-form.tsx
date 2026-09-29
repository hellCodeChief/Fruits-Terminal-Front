"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Upload,
  message,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  addProductVariantClient,
  editProductVariantBatchClient,
  uploadImage,
} from "@/components/utils/actionsClient";

type FormValueType = {
  stock: number;
  price: number;
  discountPercentage: number;
  desc: string;
  isActive: boolean;
  isDefault: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddVariantForm = ({
  productID,
  propertyOfProduct,
  onSuccess,
  refetchProduct,
  productSlug,
  variantIsEdit,
  editProductData,
  time,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedProps, setSelectedProps] = useState<{
    [key: string]: number[];
  }>({});
  const [variantCombinations, setVariantCombinations] = useState<number[][]>(
    []
  );
  const [formValues, setFormValues] = useState<FormValueType[]>([]);
  const [fileLists, setFileLists] = useState<{ [key: number]: any[] }>({});
  const [allSamePrice, setAllSamePrice] = useState(false);
  const [allSameDiscount, setAllSameDiscount] = useState(false);
  const [allSameStock, setAllSameStock] = useState(false);

  const arraysEqual = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  };

  // Load existing variant values when editing
  useEffect(() => {
    if (!editProductData?.variants || !variantCombinations.length) return;

    const initialFormValues = variantCombinations.map((combo) => {
      const matchedVariant = editProductData.variants.find((variant: any) => {
        const ids = variant.propertyProductVariants
          .map((p: any) => p.propertyValueId)
          .sort();
        return arraysEqual(ids, combo);
      });

      if (matchedVariant) {
        return {
          stock: matchedVariant.stock,
          price: parseFloat(matchedVariant.price),
          discountPercentage: matchedVariant.discountPercentage,
          desc: matchedVariant.desc || "",
          isActive: matchedVariant.isActive,
          isDefault: matchedVariant.isDefault,
        };
      } else {
        return {
          stock: 0,
          price: 0,
          discountPercentage: 0,
          desc: "",
          isActive: true,
          isDefault: false,
        };
      }
    });

    setFormValues(initialFormValues);
  }, [editProductData, variantCombinations]);

  // Initialize form when editing
  useEffect(() => {
    if (variantIsEdit && editProductData?.variants?.length > 0) {
      const combos = editProductData.variants.map((v: any) =>
        v.propertyProductVariants.map((p: any) => p.propertyValueId)
      );
      setVariantCombinations(combos);

      const initialFormVals = editProductData.variants.map((v: any) => ({
        stock: v.stock,
        desc: v.desc,
        isActive: v.isActive,
        isDefault: v.isDefault,
        price: parseFloat(v.price),
        discountPercentage: v.discountPercentage,
        id: v.id,
      }));
      setFormValues(initialFormVals);

      const selected: { [key: string]: number[] } = {};
      propertyOfProduct.forEach((property: any) => {
        const valuesForProperty = editProductData.variants
          .map((variant: any) => {
            const p = variant.propertyProductVariants.find(
              (ppv: any) => ppv.propertyId === property.id
            );
            return p?.propertyValueId;
          })
          .filter(Boolean);
        selected[property.id] = Array.from(new Set(valuesForProperty));
      });
      setSelectedProps(selected);
    } else {
      setVariantCombinations([]);
      setFormValues([]);
      setSelectedProps({});
      setFileLists({});
      setAllSamePrice(false);
      setAllSameDiscount(false);
      setAllSameStock(false);
    }
  }, [variantIsEdit, editProductData, time]);

  // Update variant combinations when selectedProps change
  useEffect(() => {
    const propsValuesArrays = Object.values(selectedProps);
    if (propsValuesArrays.length === 0) {
      setVariantCombinations([]);
      setFormValues([]);
      return;
    }

    const cartesian = (arrays: any[][]): any[][] =>
      arrays.reduce(
        (a, b) =>
          a
            .map((x: any) => b.map((y: any) => x.concat([y])))
            .reduce((a: any, b: any) => a.concat(b), []),
        [[]]
      );

    const combos = cartesian(propsValuesArrays);
    setVariantCombinations(combos);

    // Preserve previous formValues if combination exists
    const newFormValues = combos.map((combo) => {
      const existingIndex = variantCombinations.findIndex((c) =>
        arraysEqual(c, combo)
      );
      if (existingIndex !== -1) return formValues[existingIndex];
      return {
        stock: 0,
        price: 0,
        discountPercentage: 0,
        desc: "",
        isActive: true,
        isDefault: false,
      };
    });

    setFormValues(newFormValues);
  }, [selectedProps]);

  const handlePropChange = (propertyId: string, values: number[]) => {
    setSelectedProps((prev) => ({ ...prev, [propertyId]: values }));
  };

  const handleSwitchDefaultChange = (index: number, checked: boolean) => {
    setFormValues((prev) =>
      prev.map((item, i) => ({
        ...item,
        isDefault: i === index ? checked : false,
      }))
    );
  };

  const handleInputChange = (
    index: number,
    field: keyof FormValueType,
    value: any
  ) => {
    setFormValues((prev) => {
      const updated = prev.map((item, i) => {
        if (field === "price" && allSamePrice && index === 0)
          return { ...item, price: value };
        if (field === "discountPercentage" && allSameDiscount && index === 0)
          return { ...item, discountPercentage: value };
        if (field === "stock" && allSameStock && index === 0)
          return { ...item, stock: value };
        if (i === index) return { ...item, [field]: value };
        return item;
      });

      if (index === 0) {
        return updated.map((item, i) => {
          if (i === 0) return item;
          return {
            ...item,
            price: allSamePrice ? updated[0].price : item.price,
            discountPercentage: allSameDiscount
              ? updated[0].discountPercentage
              : item.discountPercentage,
            stock: allSameStock ? updated[0].stock : item.stock,
          };
        });
      }
      return updated;
    });
  };

  const handleFileChange = (index: number, { fileList }: any) => {
    setFileLists((prev) => ({ ...prev, [index]: fileList }));
  };

  const slugify = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

  const handleSubmit = async () => {
    if (variantCombinations.length === 0) {
      message.error("لطفاً حداقل یک واریانت انتخاب کنید");
      return;
    }
    setLoading(true);

    try {
      const valueIdToFNameMap = new Map<number, string>();
      const valueIdToENameMap = new Map<number, string>();
      propertyOfProduct.forEach((prop: any) => {
        prop.propertyValues.forEach((val: any) => {
          valueIdToFNameMap.set(val.id, val.Fvalue);
          valueIdToENameMap.set(val.id, val.Evalue);
        });
      });

      const variantsToSend = variantCombinations.map((combo, index) => {
        const data = formValues[index];
        const props = propertyOfProduct.map((prop: any, i: number) => ({
          propertyId: prop.id,
          propertyValueId: combo[i],
        }));

        const fNames = combo.map((id) => valueIdToFNameMap.get(id) || "");
        const eNames = combo.map((id) => valueIdToENameMap.get(id) || "");

        const variantName = [productSlug, ...fNames].join(" ");
        const variantSlug = slugify([productSlug, ...eNames].join("-"));

        let existingId;
        if (variantIsEdit && editProductData?.variants) {
          const matchedVariant = editProductData.variants.find(
            (variant: any) => {
              const ids = variant.propertyProductVariants
                .map((p: any) => p.propertyValueId)
                .sort();
              return arraysEqual(ids, combo.slice().sort());
            }
          );
          if (matchedVariant) existingId = matchedVariant.id;
        }

        return {
          ...data,
          id: existingId,
          productId: variantIsEdit ? editProductData.id : productID,
          isDefault: data.isDefault,
          props,
          name: variantName,
          slug: variantSlug,
        };
      });

      let response;
      if (variantIsEdit) {
        response = await editProductVariantBatchClient({
          variants: variantsToSend,
        });
      } else {
        response = await addProductVariantClient({ variants: variantsToSend });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "خطا در افزودن واریانت‌ها");
      }

      const createdVariants = await response.json();

      for (let i = 0; i < createdVariants.length; i++) {
        const fileListForVariant = fileLists[i];
        const variantId = createdVariants[i].id;
        if (fileListForVariant && fileListForVariant.length > 0) {
          const file = fileListForVariant[0].originFileObj;
          const formData = new FormData();
          formData.append("file", file);
          try {
            await uploadImage(variantId, "product-variant", formData);
          } catch (error) {
            message.warning("افزودن انجام شد، اما آپلود تصویر موفق نبود");
          }
        }
      }

      message.success("واریانت‌ها با موفقیت اضافه شدند");
      onSuccess(editProductData?.id ?? productID);
      refetchProduct();
    } catch (error: any) {
      message.error(error.message || "خطا در ارسال فرم واریانت‌ها");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl">
      {propertyOfProduct.map((property: any) => (
        <Form.Item
          key={property.id}
          label={property.Fname}
          rules={[
            {
              required: true,
              message: `لطفاً ${property.Fname} را انتخاب کنید`,
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder={`انتخاب ${property.Fname}`}
            onChange={(values) => handlePropChange(property.id, values)}
            value={selectedProps[property.id] || []}
          >
            {property.propertyValues.map((value: any) => (
              <Select.Option key={value.id} value={value.id}>
                {value.Fvalue}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ))}

      <Form.Item>
        <Checkbox
          checked={allSamePrice}
          onChange={(e) => setAllSamePrice(e.target.checked)}
        >
          همه قیمت‌ها یکسان باشند
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Checkbox
          checked={allSameDiscount}
          onChange={(e) => setAllSameDiscount(e.target.checked)}
        >
          همه تخفیف‌ها یکسان باشند
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Checkbox
          checked={allSameStock}
          onChange={(e) => setAllSameStock(e.target.checked)}
        >
          همه موجودی‌ها یکسان باشند
        </Checkbox>
      </Form.Item>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          <thead>
            <tr>
              {propertyOfProduct.map((p: any) => (
                <th key={p.id} style={{ border: "1px solid #ddd", padding: 8 }}>
                  {p.Fname}
                </th>
              ))}
              <th style={{ border: "1px solid #ddd", padding: 8 }}>قیمت</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>تخفیف</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>موجودی</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>توضیحات</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>فعال</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>اصلی</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>
                تصویر موجود
              </th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>تصویر</th>
            </tr>
          </thead>
          <tbody>
            {variantCombinations.map((combo, rowIndex) => {
              let variantFiles: any[] = [];
              if (variantIsEdit && editProductData?.variants) {
                const matchedVariant = editProductData.variants.find(
                  (variant: any) => {
                    const ids = variant.propertyProductVariants
                      .map((p: any) => p.propertyValueId)
                      .sort();
                    return arraysEqual(ids, combo.slice().sort());
                  }
                );
                if (matchedVariant) variantFiles = matchedVariant.files || [];
              }

              const imageUrl =
                variantFiles.length > 0
                  ? `${BASE_URL}/files/${variantFiles[0].id}/${variantFiles[0].usage}`
                  : null;

              return (
                <tr key={rowIndex}>
                  {propertyOfProduct.map((property: any, colIndex: any) => {
                    const valId = combo.find((valId) =>
                      property.propertyValues.some((pv: any) => pv.id === valId)
                    );
                    const valObj = property.propertyValues.find(
                      (pv: any) => pv.id === valId
                    );
                    return (
                      <td
                        key={colIndex}
                        style={{ border: "1px solid #ddd", padding: 8 }}
                      >
                        {valObj?.Fvalue || ""}
                      </td>
                    );
                  })}
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      minWidth: 100,
                    }}
                  >
                    <InputNumber
                      min={0}
                      value={formValues[rowIndex]?.price}
                      onChange={(val) =>
                        handleInputChange(rowIndex, "price", val)
                      }
                      disabled={allSamePrice && rowIndex !== 0}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      minWidth: 100,
                    }}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      value={formValues[rowIndex]?.discountPercentage}
                      onChange={(val) =>
                        handleInputChange(rowIndex, "discountPercentage", val)
                      }
                      disabled={allSameDiscount && rowIndex !== 0}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      minWidth: 100,
                    }}
                  >
                    <InputNumber
                      min={0}
                      value={formValues[rowIndex]?.stock}
                      onChange={(val) =>
                        handleInputChange(rowIndex, "stock", val)
                      }
                      disabled={allSameStock && rowIndex !== 0}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      minWidth: 120,
                    }}
                  >
                    <Input.TextArea
                      value={formValues[rowIndex]?.desc}
                      onChange={(e) =>
                        handleInputChange(rowIndex, "desc", e.target.value)
                      }
                      rows={1}
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    <Switch
                      checked={formValues[rowIndex]?.isActive}
                      onChange={(checked) =>
                        handleInputChange(rowIndex, "isActive", checked)
                      }
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    <Switch
                      checked={formValues[rowIndex]?.isDefault}
                      onChange={(checked) =>
                        handleSwitchDefaultChange(rowIndex, checked)
                      }
                    />
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      minWidth: 100,
                      maxWidth: 100,
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="existing variant"
                        style={{
                          maxWidth: "80px",
                          maxHeight: "80px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      minWidth: 150,
                    }}
                  >
                    <Upload
                      accept="image/*"
                      listType="picture"
                      maxCount={1}
                      fileList={fileLists[rowIndex] || []}
                      onChange={(info) => handleFileChange(rowIndex, info)}
                    >
                      <Button icon={<UploadOutlined />}>آپلود تصویر</Button>
                    </Upload>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        style={{ marginTop: 20 }}
      >
        ثبت واریانت‌ها
      </Button>
    </div>
  );
};

export default AddVariantForm;
