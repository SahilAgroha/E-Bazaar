export const uploadToCloudinary = async (pics) => {
  const cloud_name = "doqpavxwl";
  const upload_preset = "buy-baazar";

  if (!pics) {
    console.error("error: pics not found");
    return null;
  }

  try {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", upload_preset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const fileData = await res.json();

    if (fileData.error) {
      console.error("Cloudinary Upload Error:", fileData.error.message);
      return null;
    }

    return fileData.secure_url; // ✅ use secure_url for https link
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
};
