import { authFetch } from "@/components/utils/helper/authFetch";
import * as auth from "./api/authClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const { register, login, getUserInfo } = auth;
export const addCategoryClient = async (categoryData) => {
  try {
    const response = await authFetch(`${BASE_URL}/category`, {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to add category", err);
  }
};

export const logoutRequest = async () => {
  try {
    const response = await authFetch(`${BASE_URL}/auth/logout`, {
      method: "GET",
    });

    return response.json();
  } catch (err) {
    throw new Error("Logout failed", err);
  }
};
export const editCategoryClient = async (_id, _categoryData) => {
  try {
    const response = await authFetch(`${BASE_URL}/category/${_id}`, {
      method: "PUT",
      body: JSON.stringify(_categoryData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to edit category", err);
  }
};
export const getAllCategoriesClient = async () => {
  try {
    const res = await fetch(`${BASE_URL}/category`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch category");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err.message || "An error occurred while fetching category");
  }
};
export const softDeleteCategoriesClient = async (_id) => {
  try {
    const res = await authFetch(`${BASE_URL}/category/${_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete category");
    }
    const data = await res.json();

    return data; // Return successful response
  } catch (err) {
    throw new Error(err.message || "An error occurred while deleting");
  }
};

export const hardDeleteCategoriesClient = async (_id) => {
  try {
    const res = await authFetch(`${BASE_URL}/category/hard-delete/${_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete category");
    }
    const data = await res.json();

    return data; // Return successful response
  } catch (err) {
    throw new Error(err.message || "An error occurred while deleting");
  }
};

// ________________

function productList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function getAllDailyProductClient() {
  try {
    const res = await authFetch(`${BASE_URL}/daily-product`, {});
    const data = await res.json();
    return productList(data);
  } catch (err) {
    console.log("handling error", err);
    return [];
  }
}

export const addDailyProductClient = async (_productData) => {
  try {
    const response = await authFetch(`${BASE_URL}/daily-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_productData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to add daily product", err);
  }
};

// ✅ ویرایش همان ردیف dailyProduct؛ ردیف‌های دیگر پاک نمی‌شوند
export const editDailyProductClient = async (_productData, _id) => {
  try {
    const response = await authFetch(`${BASE_URL}/daily-product/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_productData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to edit daily product", err);
  }
};

export const softDeleteDailyProductClient = async (_id) => {
  try {
    const res = await authFetch(`${BASE_URL}/daily-product/${_id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete daily product");
    }
    return await res.json();
  } catch (err) {
    throw new Error(err.message || "An error occurred while deleting");
  }
};

export const hardDeleteDailyProductClient = async (_id) => {
  try {
    const res = await authFetch(`${BASE_URL}/daily-product/hard-delete/${_id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete daily product");
    }
    return await res.json();
  } catch (err) {
    throw new Error(err.message || "An error occurred while deleting");
  }
};

export async function getAllProductClient() {
  try {
    const res = await authFetch(`${BASE_URL}/product`, {});
    const data = await res.json();
    return productList(data);
  } catch (err) {
    console.log("handling error", err);
    return [];
  }
}

export const addProductClient = async (_productData) => {
  try {
    const response = await authFetch(`${BASE_URL}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_productData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to add category", err);
  }
};

export const editProductClient = async (_productData, _id) => {
  try {
    const response = await authFetch(`${BASE_URL}/product/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_productData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to add category", err);
  }
};

export const addProductVariantClient = async (_variantData) => {
  try {
    const response = await authFetch(`${BASE_URL}/product-variant`, {
      method: "POST",

      body: JSON.stringify(_variantData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to add variant", err);
  }
};

export const editProductVariantBatchClient = async (_variantData) => {
  try {
    const response = await authFetch(`${BASE_URL}/product-variant/batch`, {
      method: "PATCH",

      body: JSON.stringify(_variantData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to add variant", err);
  }
};

export const findProductClient = async (id) => {
  try {
    const response = await authFetch(`${BASE_URL}/product/${id}`, {});
    return await response.json();
  } catch (err) {
    throw new Error("Failed to fetch product", err);
  }
};

export const softDeleteProductClient = async (_id) => {
  try {
    const res = await authFetch(`${BASE_URL}/product/${_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete product");
    }
    const data = await res.json();

    return data; // Return successful response
  } catch (err) {
    throw new Error(err.message || "An error occurred while deleting");
  }
};

export const hardDeleteProductClient = async (_id) => {
  try {
    const res = await authFetch(`${BASE_URL}/product/hard-delete/${_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete product");
    }
    const data = await res.json();

    return data; // Return successful response
  } catch (err) {
    throw new Error(err.message || "An error occurred while deleting");
  }
};
// _________________

export const addPropertyClient = async (propertyData) => {
  try {
    const response = await authFetch(`${BASE_URL}/property`, {
      method: "POST",
      body: JSON.stringify(propertyData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to add property", err);
  }
};

export async function getAllPropertyClient() {
  try {
    const res = await fetch(`${BASE_URL}/property`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log("handling error", err);
  }
}
export async function getPropertyClient(id) {
  try {
    const res = await fetch(`${BASE_URL}/property/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log("handling error", err);
  }
}
export async function addPropertyValueClient(propertyValue) {
  try {
    const res = await authFetch(`${BASE_URL}/property-value`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyValue),
    });

    return res;
  } catch (err) {
    console.log("handling error", err);
  }
}
// upload

export const uploadImage = async (_id, _usage, _formData) => {
  try {
    const url = `${BASE_URL}/${_usage}/upload/${_id}`;

    const res = await authFetch(url, {
      method: "POST",
      body: _formData,
    });

    if (!res.ok) {
      throw new Error("خطا در آپلود فایل");
    }

    return await res.json(); // یا هر چیزی که سرور برمی‌گردونه
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// user

export async function getAllUsersClient() {
  try {
    const res = await authFetch(`${BASE_URL}/users/all`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log("handling error", err);
  }
}

export const assignUserRoleClient = async (_roleId, _userId) => {
  try {
    const response = await authFetch(
      `${BASE_URL}/users/assign-role/${_userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_roleId),
      }
    );
    return response;
  } catch (err) {
    throw new Error("Failed to assign role to user", err);
  }
};

// permission

export async function getAllPermissionClient() {
  try {
    const res = await authFetch(`${BASE_URL}/permission`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log("handling error", err);
  }
}

// role
export async function getAllroleClient() {
  try {
    const res = await authFetch(`${BASE_URL}/role`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log("handling error", err);
  }
}

export const addRoleClient = async (propertyData) => {
  try {
    const response = await authFetch(`${BASE_URL}/role`, {
      method: "POST",
      body: JSON.stringify(propertyData),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to add property", err);
  }
};

// basket
export const getUserOpenBasket = async (_id) => {
  try {
    const response = await authFetch(
      `${BASE_URL}/basket?userId=${_id}&status=open`,
      {
        method: "GET",
      }
    );

    let data = await response.json();

    return data;
  } catch (err) {
    throw new Error("Failed to get user open basket", err);
  }
};

export const addToBasketClient = async (_items) => {
  try {
    const response = await authFetch(`${BASE_URL}/basket`, {
      method: "POST",
      body: JSON.stringify({ items: _items }),
    });
    return response;
  } catch (err) {
    throw new Error("Failed to add to basket", { cause: err });
  }
};

//checkout basket
// basket
export const checkoutBasketClient = async (_basketId) => {
  try {
    const response = await authFetch(
      `${BASE_URL}/basket/checkout/${_basketId}`,
      {
        method: "GET",
      }
    );

    let data = await response.json();

    return data;
  } catch (err) {
    throw new Error("Failed to checkout basket", err);
  }
};
