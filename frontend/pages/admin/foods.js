import React, { useState, useEffect, useMemo } from "react";
import AdminDrawer from "../../components/admin/AdminDrawer";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Add, Cancel } from "@mui/icons-material";
import { Modal, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchFoods } from "../../redux/slices/foodSlice";
import { useSnackbar } from "notistack";
import Router from "next/router";
import axios from "axios";
import Loading from "../../components/Loading";
import AdminFoodList from "../../components/admin/AdminFoodList";

// ✅ NEW: drag/drop + upload helper
import ImageDropzone from "../../components/ImageDropzone";
import {
  uploadToCloudinary,
  optimizeCloudinaryUrl,
} from "../../utils/cloudinaryUpload";

const FoodsAdminPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.user?.user ?? null);
  const data = useSelector((state) => state?.food?.data ?? []);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  useEffect(() => {
    if (user === null) Router.push("/");
  }, [user]);

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  const resetForm = () => {
    setName("");
    setCategory("");
    setCost("");
    setDescription("");
    setFile(null);
    setUploadProgress(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !category.trim() || !cost.trim()) {
      enqueueSnackbar("⚠️ Please fill name, category and price.", {
        variant: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    if (!file) {
      enqueueSnackbar("⚠️ Please choose an image.", {
        variant: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    setLoading(true);
    setUploadProgress(null);

    try {
      enqueueSnackbar("⏳ Uploading image...", {
        variant: "info",
        autoHideDuration: 1200,
      });

      // ✅ Upload + compression + progress
      let imageUrl = await uploadToCloudinary(file, (p) => setUploadProgress(p));
      imageUrl = optimizeCloudinaryUrl(imageUrl);

      // ✅ Get user from localStorage (for your headers)
      const userLocal =
        typeof window !== "undefined"
          ? JSON.parse(window.localStorage.getItem("user") || "null")
          : null;

      if (!userLocal?.email) throw new Error("User not found in localStorage");

      enqueueSnackbar("⏳ Saving food to database...", {
        variant: "info",
        autoHideDuration: 1200,
      });

      const apiRes = await axios.post(
        "https://resto-backend.vercel.app/api/food/new",
        {
          name: name.trim(),
          category: category.trim().toLowerCase(),
          cost: cost.trim(),
          description: description.trim(),
          image: imageUrl,
        },
        { headers: { email: `${userLocal.email}`, password: `admin01` } }
      );

      dispatch(fetchFoods());

      enqueueSnackbar(apiRes?.data?.message || "✅ Food added successfully!", {
        variant: "success",
        autoHideDuration: 2500,
      });

      setOpenModal(false);
      resetForm();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";
      enqueueSnackbar(`❌ ${msg}`, { variant: "error", autoHideDuration: 5000 });
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(null), 1200);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
            <AdminSidebar />
            <div className="flex-grow min-w-fit ml-5">
              <div className="flex flex-col items-center">
                <h1 className="text-lg font-semibold text-green-400 mb-5">
                  FOOD ITEMS
                </h1>
                {data.map((item) => (
                  <AdminFoodList key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="min-h-[83vh] p-3 lg:hidden">
            <div className="flex flex-col">
              <AdminDrawer />
              <div className="flex flex-col justify-center items-center mt-3">
                <h1 className="text-lg font-semibold text-green-400">
                  FOOD ITEMS
                </h1>
                {data.map((item) => (
                  <AdminFoodList key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Floating add button */}
          <Tooltip title="Add new food">
            <div
              className="fixed h-14 w-14 cursor-pointer hover:scale-110 transition duration-300 ease-in bottom-32 right-4 md:right-28 rounded-full bg-green-600 flex justify-center items-center shadow-xl"
              onClick={() => setOpenModal(true)}
            >
              <Add className="text-white font-bold text-3xl" />
            </div>
          </Tooltip>

          {/* Modal */}
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div className="h-full w-full md:h-[740px] md:w-[520px] border-none rounded-2xl outline-none bg-gray-800 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 p-4">
              <div className="flex flex-col items-center relative justify-center h-full">
                <h2 className="text-green-200 font-extrabold text-xl mb-2">
                  Add New Food
                </h2>

                <form className="w-full" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-3">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border border-white/10 bg-white/5 text-green-50 rounded-xl outline-none font-semibold placeholder:text-green-100/60"
                      type="text"
                      placeholder="Food name"
                      required
                    />

                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 border border-white/10 bg-white/5 text-green-50 rounded-xl outline-none font-semibold placeholder:text-green-100/60"
                      type="text"
                      placeholder="Category (ex: rice, cameroon, chinese...)"
                      required
                    />

                    <input
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full p-3 border border-white/10 bg-white/5 text-green-50 rounded-xl outline-none font-semibold placeholder:text-green-100/60"
                      type="text"
                      placeholder="Price (ex: 1000f or €6.90)"
                      required
                    />

                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 border border-white/10 bg-white/5 text-green-50 rounded-xl outline-none font-semibold placeholder:text-green-100/60"
                      rows={4}
                      placeholder="Description"
                    />

                    {/* ✅ Drag & Drop + preview + progress */}
                    <ImageDropzone
                      file={file}
                      setFile={setFile}
                      previewUrl={previewUrl}
                      progress={uploadProgress}
                    />

                    <button
                      type="submit"
                      className="bg-emerald-400 text-emerald-950 font-extrabold p-3 rounded-xl w-full hover:bg-emerald-300 transition"
                    >
                      Add New Food
                    </button>
                  </div>
                </form>

                <div className="absolute top-2 left-2 flex justify-center items-center bg-white/5 hover:bg-white/10 transition h-10 w-10 rounded-full cursor-pointer">
                  <Cancel
                    className="text-green-100"
                    onClick={() => setOpenModal(false)}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default FoodsAdminPage;