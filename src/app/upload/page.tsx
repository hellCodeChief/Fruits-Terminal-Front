"use client";
import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UploadPage() {
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.elements.namedItem(
      "file"
    ) as HTMLInputElement;
    if (!fileInput?.files?.[0]) return;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const res = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.url);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" name="file" />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>

      {imageUrl && (
        <div className="mt-6">
          <p>آپلود شد:</p>
          <img
            src={imageUrl}
            alt="Product"
            className="max-w-full mt-2 rounded shadow"
          />
        </div>
      )}
    </div>
  );
}
