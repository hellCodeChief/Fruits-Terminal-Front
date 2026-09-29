const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const register = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  } catch (err) {
    throw new Error(err.message || "An error occurred during register");
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  } catch (err) {
    throw new Error(err.message || "An error occurred during login");
  }
};

export const getUserInfo = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user info");
    }
    let temp = await response.json();

    return temp;
  } catch (err) {
    throw new Error(err.message || "An error occurred");
  }
};
