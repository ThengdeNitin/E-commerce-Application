import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const navigate = useNavigate();

  const [uploadProductImage, { isLoading: uploading }] =
    useUploadProductImageMutation();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message || "Uploaded");

      let imgUrl = res.image;
      if (!imgUrl.startsWith("/")) {
        imgUrl = `${imgUrl.replace(/\\/g, "/")}`;
      }

      setImageUrl(imgUrl);
    } catch (err) {
      console.error("upload error:", err);
      toast.error(err?.data?.message || "Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) return toast.error("Please upload an image first");
    if (!name || !price || !category || !brand)
      return toast.error("Please fill required fields");

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      quantity: Number(quantity || 0),
      brand: brand.trim(),
      countInStock: Number(stock || 0),
      image: imageUrl,
    };

    try {
      const res = await createProduct(payload).unwrap();
      toast.success(`${res.name} created successfully`);
      navigate("/admin/productlist");
      window.location.reload();
    } catch (err) {
      console.error("create error:", err);
      const msg = err?.data?.error || err?.error || JSON.stringify(err);
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
        <AdminMenu />

      <div className="md:w-full w-full p-4 m-10">
        <h2 className="font-bold text-2xl mb-5">Create Product</h2>

        {imageUrl && (
          <div className="text-center mb-4">
            <img
              src={
                imageUrl.startsWith("http")
                  ? imageUrl
                  : `${window.location.origin}${imageUrl}`
              }
              alt="product"
              className="mx-auto max-h-[200px] object-contain rounded-lg"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-8 bg-[#101011] hover:bg-[#202022] transition">
            {imageUrl ? "Image Selected" : "Upload Image"}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className="hidden"
            />
          </label>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-3 w-full border rounded-lg bg-[#101011] !text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="p-3 w-full border rounded-lg bg-[#101011] !text-white"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="number"
              placeholder="Quantity"
              className="p-3 w-full border rounded-lg bg-[#101011] !text-white"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Brand"
              className="p-3 w-full border rounded-lg bg-[#101011] !text-white"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <textarea
            placeholder="Description"
            className="p-3 border rounded-lg w-full bg-[#101011] !text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="number"
              placeholder="Count In Stock"
              className="p-3 w-full border rounded-lg bg-[#101011] !text-white"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 w-full border rounded-lg bg-[#101011] !text-white"
            >
              <option value="">Select Category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="py-3 px-6 mt-3 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 transition"
          >
            {creating ? "Creating..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductList;
