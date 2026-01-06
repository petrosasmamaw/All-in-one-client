import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientByUserId,
  createClient,
  updateClient,
} from "../Slice/clientSlice";


const Profile = ({ userId }) => {
  const dispatch = useDispatch();
  const { client, status } = useSelector((state) => state.clients);

  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    image: null,
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchClientByUserId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        phoneNo: client.phoneNo || "",
        image: null,
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (client) {
      dispatch(
        updateClient({
          id: client._id,
          clientData: { ...formData, userId },
        })
      );
    } else {
      dispatch(
        createClient({
          ...formData,
          userId,
        })
      );
    }
  };

  return (
    <div className="profile-container">
      <div className="page-header-row">
        <div className="page-icon" aria-hidden>📝</div>
        <div>
          <h3>Profile</h3>
          <p className="muted">Manage your client profile and contact info.</p>
        </div>
      </div>
      <h2 className="profile-title">
        {client ? "Update Profile" : "Create Profile"}
      </h2>

      {client?.image && (
        <img
          src={client.image}
          alt="Profile"
          className="profile-image"
        />
      )}

      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          className="profile-input"
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className="profile-input"
          type="text"
          name="phoneNo"
          placeholder="Phone Number"
          value={formData.phoneNo}
          onChange={handleChange}
          required
        />

        <input
          className="profile-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button
          className="profile-btn"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading"
            ? "Saving..."
            : client
            ? "Update Profile"
            : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
