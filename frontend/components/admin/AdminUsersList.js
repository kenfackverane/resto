import { Delete } from "@mui/icons-material";
import React from "react";
import { useSnackbar } from "notistack";

const AdminUsersList = ({ item }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const url = `https://restoback-lime.vercel.app/api/user/${item._id}`;
    const options = {method: 'DELETE', headers: {email: `${user.email}`, password: "admin01"}};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
  enqueueSnackbar(data.message, {
    variant: "success",
    autoHideDuration: 3000,
  });
} catch (error) {
  console.error(error);
}
  };

  return (
    <>
      <div className="flex justify-between items-center p-3 bg-gray-600 w-[18rem] md:w-[20rem] lg:w-[25rem]  rounded-xl mb-3">
        <h1 className="text-green-100 font-semibold">{item.name}</h1>
        <h1 className="text-green-100 font-semibold">{item.email}</h1>
        <div>
          <Delete
            onClick={handleDelete}
            className="text-green-400 cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default AdminUsersList;
