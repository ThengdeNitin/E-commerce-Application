import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setStock(productData.countInStock);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully", { autoClose: 2000 });
      setImage(res.image);
    } catch (err) {
      console.log(err);
      toast.error("Image upload failed", { autoClose: 2000 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productPayload = {
        name,
        description,
        price: Number(price),
        category,
        quantity: Number(quantity),
        brand,
        countInStock: Number(stock),
        image,
      };

      await updateProduct({ productId: params._id, ...productPayload }).unwrap();
      toast.success("Product updated successfully", { autoClose: 2000 });
      navigate("/admin/allproductslist");
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Product update failed", { autoClose: 2000 });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(params._id).unwrap();
      toast.success("Product deleted successfully", { autoClose: 2000 });
      navigate("/admin/allproductslist");
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed", { autoClose: 2000 });
    }
  };

  const handleBack = () => navigate("/admin/allproductslist");

  return (
    <div className="flex flex-col md:flex-row w-full">
        <AdminMenu />

      <div className="md:w-full w-full p-4 m-10">
        <h2 className="text-white text-2xl font-bold mb-4">Update / Delete Product</h2>

        {image && (
          <div className="text-center mb-4">
            <img
              src={image.startsWith("http") ? image : `${window.location.origin}${image}`}
              alt="product"
              className="mx-auto w-full max-h-[200px] object-contain rounded-lg"
            />
          </div>
        )}

        <label className="block text-center cursor-pointer text-white p-4 border rounded-lg mb-4 bg-[#101011] hover:bg-[#202022] transition">
          Upload Image
          <input type="file" accept="image/*" onChange={uploadFileHandler} className="hidden" />
        </label>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-3 w-full md:w-1/2 border rounded-lg bg-[#101011] text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="p-3 w-full md:w-1/2 border rounded-lg bg-[#101011] text-white"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="number"
              placeholder="Quantity"
              className="p-3 w-full md:w-1/2 border rounded-lg bg-[#101011] text-white"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Brand"
              className="p-3 w-full md:w-1/2 border rounded-lg bg-[#101011] text-white"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <textarea
            placeholder="Description"
            className="p-3 w-full border rounded-lg bg-[#101011] text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="number"
              placeholder="Count In Stock"
              className="p-3 w-full md:w-1/2 border rounded-lg bg-[#101011] text-white"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <select
              className="p-3 w-full md:w-1/2 border rounded-lg bg-[#101011] text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <button type="submit" className="py-3 px-6 bg-green-600 rounded-lg font-bold w-full md:w-auto">
              Update
            </button>
            <button type="button" onClick={handleDelete} className="py-3 px-6 bg-pink-600 rounded-lg font-bold w-full md:w-auto">
              Delete
            </button>
            <button type="button" onClick={handleBack} className="py-3 px-6 bg-blue-500 rounded-lg font-bold w-full md:w-auto">
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
