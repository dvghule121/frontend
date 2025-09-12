import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateResumeField } from '../../../store/slices/profileFormSlice';
import { useProfileInfo } from '../../../hooks/useProfileInfo';
import { useDebounce } from '../../../hooks/useDebounce';

const PersonalInformationStep = () => {
  const dispatch = useDispatch();
  const formDataRedux = useSelector(state => state.profileForm.resume);
  const { data: formData, loading, error, saveProfileInfo } = useProfileInfo();
  const isInitialized = useRef(false); // Ref to track if Redux state has been initialized

  // Debounce the saveProfileInfo function
  const debouncedSaveProfileInfo = useDebounce(async (profileData) => {
    try {
      await saveProfileInfo(profileData);
    } catch (err) {
      console.error("Failed to save profile info:", err);
    }
  }, 1000);

  // Initialize Redux state with formData if it exists
  useEffect(() => {
    if (formData && !isInitialized.current) {
      dispatch(updateResumeField({ field: 'full_name', value: formData.full_name }));
      dispatch(updateResumeField({ field: 'professional_title', value: formData.professional_title }));
      dispatch(updateResumeField({ field: 'email', value: formData.email }));
      dispatch(updateResumeField({ field: 'phone', value: formData.phone }));
      dispatch(updateResumeField({ field: 'location', value: formData.location }));
      isInitialized.current = true; // Mark as initialized
    }
  }, [formData, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateResumeField({ field: name, value })); // Keep Redux in sync
    debouncedSaveProfileInfo({ ...formDataRedux, [name]: value }); // Send formDataRedux to API
  };

  if (loading) return <div>Loading personal information...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="full_name"
            value={formDataRedux?.full_name || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title *
          </label>
          <input
            type="text"
            name="professional_title"
            value={formDataRedux?.professional_title || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Software Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formDataRedux?.email || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formDataRedux?.phone || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 123-456-7890"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formDataRedux?.location || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., New York, NY, USA"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationStep;
