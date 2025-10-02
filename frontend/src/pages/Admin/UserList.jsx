import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">NAME</th>
                  <th className="px-4 py-2 text-left">EMAIL</th>
                  <th className="px-4 py-2 text-left">ADMIN</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="px-4 py-2 break-all">{user._id}</td>

                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex flex-col md:flex-row gap-2">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          {user.username}
                          <button onClick={() => toggleEdit(user._id, user.username, user.email)}>
                            <FaEdit className="ml-2 text-gray-500 hover:text-gray-300" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex flex-col md:flex-row gap-2">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <a href={`mailto:${user.email}`} className="truncate">
                            {user.email}
                          </a>
                          <button onClick={() => toggleEdit(user._id, user.username, user.email)}>
                            <FaEdit className="ml-2 text-gray-500 hover:text-gray-300" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-2 text-center">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500 mx-auto" />
                      ) : (
                        <FaTimes className="text-red-500 mx-auto" />
                      )}
                    </td>

                    <td className="px-4 py-2 text-center">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
