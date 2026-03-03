import { Cancel, Delete, Edit, Image } from "@mui/icons-material";
import React, { useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Modal } from "@mui/material";

const AdminFoodList = ({ item }) => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState(item?.name || "");
  const [category, setCategory] = useState(item?.category || "");
  const [cost, setCost] = useState(item?.cost || "");
  const [description, setDescription] = useState(item?.description || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  // preview image
  const previewUrl = useMemo(() => {
    if (!selectedImage) return item?.image || "";
    return URL.createObjectURL(selectedImage);
  }, [selectedImage, item]);

  // delete food
  const handleDelete = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(
        `https://restoback-lime.vercel.app/api/food/${item._id}`,
        {
          method: "DELETE",
          headers: { email: user.email, password: "admin01" },
        }
      );

      const data = await res.json();

      enqueueSnackbar(data.message || "Deleted", {
        variant: "success",
      });
    } catch {
      enqueueSnackbar("Delete failed", { variant: "error" });
    }
  };

  // ✅ upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // preset public

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
  };

  // update food
  const handleUpdate = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) {
      enqueueSnackbar("Not logged in", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = item?.image;

      // upload new image if selected
      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      const res = await axios.put(
        `https://restoback-lime.vercel.app/api/food/${item._id}`,
        { name, category, cost, description, image: imageUrl },
        { headers: { email: user.email, password: "admin01" } }
      );

      enqueueSnackbar(res.data.message || "Updated", {
        variant: "success",
      });

      setOpenModal(false);
      setSelectedImage(null);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center p-3 bg-gray-600 w-[18rem] md:w-[20rem] lg:w-[25rem] rounded-xl mb-3">
      <h1 className="text-green-100 font-semibold">{item.name}</h1>

      <div>
        <Edit
          onClick={() => setOpenModal(true)}
          className="text-green-400 cursor-pointer"
        />

        <Delete
          onClick={handleDelete}
          className="text-green-400 ml-3 cursor-pointer"
        />

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <div className="h-full w-full md:h-[650px] md:w-[450px] bg-gray-700 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-lg p-5">
            <form onSubmit={handleUpdate} className="flex flex-col items-center">

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none"
                placeholder="Food name"
              />

              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none"
                placeholder="Category"
              />

              <input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none"
                placeholder="Price"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none"
                placeholder="Description"
              />

              {/* choose image */}
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <Image className="text-green-500" />
                <span className="text-white text-sm">
                  {selectedImage?.name || "Choose image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
              </label>

              {/* preview */}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="mt-4 h-40 w-40 object-cover rounded-xl"
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-green-400 text-black font-bold p-3 rounded-lg w-full mt-5 hover:bg-green-300"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </form>

            <Cancel
              className="absolute top-3 left-3 cursor-pointer"
              onClick={() => setOpenModal(false)}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminFoodList;