const INTERNAL_BASE_URL = process.env.INTERNAL_API_BASE_URL;

export async function getAllCategoriesISR() {
  try {
    const res = await fetch(`${INTERNAL_BASE_URL}/category`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // ISR فعال شده
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("handling error", err);
    return [];
  }
}
// export async function getPerentCategoriesISR() {
//   try {
//     const res = await fetch(`${INTERNAL_BASE_URL}/category/parents`, {
//       headers: { "Content-Type": "application/json" },
//       next: { revalidate: 60 },
//     });
//     const data = await res.json();
//     return Array.isArray(data) ? data : [];
//   } catch (err) {
//     console.log("handling error", err);
//     return [];
//   }
// }

export async function getAllProductISR(_queryParams) {
  const params = new URLSearchParams();

  Object.entries(_queryParams).forEach(([key, val]) => {
    // فقط مقادیر معتبر را بفرست
    if (val !== undefined && val !== null && val !== "") {
      params.set(key, val.toString());
    }
  });

  if (_queryParams) {
    // URLSearchParams استاندارد
    Object.entries(_queryParams).forEach(([key, val]) => {
      if (String(val).trim().length > 0) {
        params.set(key, val.toString());
      }
    });
  }

  const url = `${INTERNAL_BASE_URL}/product-variant?${
    params ? params.toString() : ""
  }`;

  console.log("_queryParams...", _queryParams);
  console.log("url...", url);

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 1 },
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();

    return data;
  } catch (err) {
    console.error("handling error", err);
    return [];
  }
}

export const findProductISR = async (_id) => {
  try {
    const response = await fetch(`${INTERNAL_BASE_URL}/product/${_id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    return await response.json();
  } catch (err) {
    throw new Error("Failed to fetch product", err);
  }
};

export async function getAllPropertyISR() {
  try {
    const res = await fetch(`${INTERNAL_BASE_URL}/property`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // هر ۵ دقیقه
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("handling error", err);
  }
}
