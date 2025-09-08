import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";

const Profile = () => {
  const { user, role, fetchCurrentUser, logout, API } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
  });
  const [profileImage, setProfileImage] = useState(
    user?.profile_picture || null
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("auth_token");

      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("location", formData.location || "");
      formDataToSend.append("bio", formData.bio || "");

      // Append the file if selected
      if (selectedFile) {
        formDataToSend.append("profile_picture", selectedFile);
      }

      await API.put("/user/profile", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (fetchCurrentUser) await fetchCurrentUser();
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      alert("Failed to update profile.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;
    try {
      const token = localStorage.getItem("auth_token");
      await API.delete("/user/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (logout) logout();
    } catch (err) {
      alert("Failed to delete account.");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
    });
    setProfileImage(user?.profile_picture || null);
    setSelectedFile(null);
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Function to get the full URL for the profile picture
  const getProfileImageUrl = () => {
    if (profileImage) {
      // If it's a data URL (newly selected image)
      if (profileImage.startsWith("data:")) {
        return profileImage;
      }
      // If it's a stored image path
      return `${
        process.env.REACT_APP_API_URL || "http://localhost:8000"
      }/storage/profile_pictures/${profileImage}`;
    }
    return null;
  };

  return (
    <div className="py-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
          Profile
        </h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {submitting ? "Updating..." : "Save Changes"}
              </button>
            </>
          )}
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Profile Header with Image */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {getProfileImageUrl() ? (
                <img
                  src={getProfileImageUrl()}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-2xl font-semibold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            {isEditing && (
              <button
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </button>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-slate-800">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-xl font-semibold p-1 border border-gray-300 rounded"
                />
              ) : (
                user?.name || "-"
              )}
            </h2>
            <p className="text-slate-600">{role || "-"}</p>
            {isEditing && (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Add a short bio..."
                className="mt-2 w-full p-2 border border-gray-300 rounded text-sm"
                rows="2"
              />
            )}
            {!isEditing && user?.bio && (
              <p className="mt-2 text-slate-700">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid sm:grid-cols-2 gap-6 text-slate-700">
          <div>
            <div className="text-sm text-slate-500 mb-1">Email</div>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
              <div className="font-medium">{user?.email || "-"}</div>
            )}
          </div>

          <div>
            <div className="text-sm text-slate-500 mb-1">Phone</div>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
              <div className="font-medium">{user?.phone || "-"}</div>
            )}
          </div>

          <div>
            <div className="text-sm text-slate-500 mb-1">Location</div>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
              <div className="font-medium">{user?.location || "-"}</div>
            )}
          </div>

          <div>
            <div className="text-sm text-slate-500 mb-1">Role</div>
            <div className="font-medium">{role || "-"}</div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-lg font-medium text-slate-800 mb-4">
            Additional Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-500 mb-1">Member Since</div>
              <div className="font-medium">{user?.joinDate || "Jan 2023"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Status</div>
              <div className="font-medium">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
