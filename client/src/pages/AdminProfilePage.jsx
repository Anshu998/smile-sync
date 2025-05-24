import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateAvatarMutation,
} from "@/app/slices/userApiSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AdminProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [changePassword, { isLoading: passwordLoading, error }] =
    useChangePasswordMutation();

  const { data, refetch } = useGetUserProfileQuery();

  const [updateProfile, { isLoading: profileLoading, error: updateError }] =
    useUpdateProfileMutation();

  const [updateAvatar, { isLoading: avatarLoading }] =
    useUpdateAvatarMutation();
  const adminUser = data?.user;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: adminUser?.name || "",
      email: adminUser?.email || "",
      phone: adminUser?.phone || "",
      address: adminUser?.address || "",
      role: "admin",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
  } = useForm();

  const newPassword = watchPassword("newPassword");
  const confirmPassword = watchPassword("confirmPassword");

  useEffect(() => {
    if (adminUser) {
      reset({
        name: adminUser.name || "",
        email: adminUser.email || "",
        phone: adminUser.phone || "",
        address: adminUser.address || "",
      });
      setSelectedImage(data?.user.avatar?.url || "");
    }
  }, [adminUser, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Please upload only JPG, PNG or GIF images");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        setSelectedImage(reader.result);
        const data = {
          image: reader.result,
        };
        // Update the image using API CALL TO THE BACKEND
        try {
          // Send the base64 string to the backend
          const response = await updateAvatar(data).unwrap();
          console.log(response);

          // Handle the response
          if (response.success) {
            toast.success("Profile image updated successfully!");
            // setSelectedImage(response.avatar.url); // Update the displayed image
            await refetch();
          } else {
            toast.error("Failed to update profile image");
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setIsEditing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await updateProfile(data).unwrap();
      // setCredentials(response.user);
      console.log(response);
      await refetch();
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsEditing(false);
      console.log(data);
    }
  };

  const handlePasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const passwordData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      // Handle API CHANGE FOR THE PASSWORD.
      const response = await changePassword(passwordData).unwrap();
      if (!response.success) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Password changed successfully!");
      resetPassword(); // Reset the password form fields
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[100vh] flex-1">
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-6 mb-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={selectedImage} />
                    <AvatarFallback>
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white/20 p-2 rounded-full cursor-pointer">
                      <Camera size={20} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold mb-2">
                    Administrator Profile
                  </h1>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>{adminUser?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{adminUser?.phone || "No contact information"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span>Administrator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>
                      {adminUser?.address || "No address information available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.email ? "border-red-500" : "bg-gray-100"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 5,
                        message: "Address must be at least 5 characters",
                      },
                    })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Security Settings</h2>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Change Password
              </button>
            ) : (
              <form
                onSubmit={handlePasswordSubmit(handlePasswordChange)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      {...registerPassword("currentPassword", {
                        required: "Current password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                        passwordErrors.currentPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword.current ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      {...registerPassword("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                        passwordErrors.newPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword.new ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      {...registerPassword("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                        passwordErrors.confirmPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword.confirm ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AdminProfilePage;
