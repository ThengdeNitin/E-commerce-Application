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
        imgUrl = `/${imgUrl.replace(/\\/g, "/")}`;
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
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <h2 className="h-12 font-bold text-xl mb-5">Create Product</h2>

          {imageUrl && (
            <div className="text-center mb-4">
              <img
                src={
                  imageUrl.startsWith("http")
                    ? imageUrl
                    : `${window.location.origin}${imageUrl}`
                }
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
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

          <form className="p-3" onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-10">
              <div className="flex-1">
                <label>Name</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label>Price</label>
                <input
                  type="number"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-10">
              <div className="flex-1">
                <label>Quantity</label>
                <input
                  type="number"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label>Brand</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label>Description</label>
            <textarea
              className="p-2 mb-3 bg-[#101011] border rounded-lg w-full text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex flex-wrap gap-10 mt-3">
              <div className="flex-1">
                <label>Count In Stock</label>
                <input
                  type="number"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label>Category</label>
                <select
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
            >
              {creating ? "Creating..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
