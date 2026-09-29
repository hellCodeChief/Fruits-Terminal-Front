import React from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ShowVariant({ currentProductData }: any) {
  return (
    <div className="flex flex-wrap gap-1">
      {currentProductData.variants && currentProductData.variants.length > 0 ? (
        currentProductData.variants.map((variant: any) => (
          <div
            key={variant.id}
            style={{
              marginBottom: "20px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
            }}
          >
            <figure className="w-full h-[100px]">
              <img
                src={
                  variant.files.length > 0
                    ? `${BASE_URL}/files/${variant.files[0].id}/product-variant`
                    : "/temp.jpg" // مسیر تصویر پیش‌فرض خودت رو اینجا بزار
                }
                className="w-full h-full object-center object-cover"
                alt={variant.name}
              />
            </figure>
            <h4>{variant.name}</h4>
            <p>Price: {variant.price}</p>
            <p>Stock: {variant.stock}</p>
            <p>Description: {variant.desc}</p>

            {/* Show properties associated with the variant */}
            {variant.propertyProductVariants &&
              variant.propertyProductVariants.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <h5>Variant Properties</h5>
                  {variant.propertyProductVariants.map(
                    (propertyVariant: any, propertyIndex: any) => (
                      <div key={propertyIndex} style={{ marginLeft: "20px" }}>
                        <p>
                          <strong>{propertyVariant.property.Fname}:</strong>{" "}
                          {propertyVariant.propertyValue.Fvalue}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        ))
      ) : (
        <p>No variants available for this product.</p>
      )}
    </div>
  );
}
