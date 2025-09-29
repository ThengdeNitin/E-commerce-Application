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

  // Fetch product data
  const { data: productData } = useGetProductByIdQuery(params._id);

  // State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const { data: categories = [] } = useFetchCategoriesQuery();

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
  
      const data = await updateProduct({
        productId: params._id,
        ...productPayload,
      }).unwrap();

      toast.success("Product updated successfully", { autoClose: 2000 });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Product update failed", { autoClose: 2000 });
    }
  };
  


  const handleDelete = async () => {
    const answer = window.confirm("Are you sure you want to delete this product?");
    if (!answer) return;

    try {
      await deleteProduct(params._id).unwrap();
      toast.success("Product deleted successfully", { autoClose: 2000 });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed", { autoClose: 2000 });
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <h2 className="h-12 text-white text-xl font-bold">Update / Delete Product</h2>

          {image && (
            <div className="text-center mb-3">
              <img src={image} alt="product" className="mx-auto w-full max-h-[300px] object-contain" />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-center cursor-pointer text-white p-4 border rounded-lg">
              Upload Image
              <input type="file" accept="image/*" onChange={uploadFileHandler} className="hidden" />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="p-3">
            <div className="flex flex-wrap gap-6">
              <input
                type="text"
                placeholder="Name"
                className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-6 mt-3">
              <input
                type="number"
                placeholder="Quantity"
                className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <input
                type="text"
                placeholder="Brand"
                className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <textarea
              placeholder="Description"
              className="p-4 w-full mt-3 border rounded-lg bg-[#101011] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex flex-wrap gap-6 mt-3">
              <input
                type="number"
                placeholder="Count In Stock"
                className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              <select
                className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white"
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

            <div className="mt-5 flex gap-6">
              <button type="submit" className="py-4 px-10 bg-green-600 rounded-lg font-bold">
                Update
              </button>
              <button type="button" onClick={handleDelete} className="py-4 px-10 bg-pink-600 rounded-lg font-bold">
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
