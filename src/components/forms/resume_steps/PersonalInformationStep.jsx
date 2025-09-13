import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateResumeField } from '../../../store/slices/profileFormSlice';
import { useProfileInfo } from '../../../hooks/useProfileInfo';
import { FaUser, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import SaveIndicator from '../../common/SaveIndicator';

const PersonalInformationStep = () => {
  const dispatch = useDispatch();
  const formDataRedux = useSelector(state => state.profileForm.resume);
  const { data: formData, loading, saving, error, debouncedSaveProfileInfo } = useProfileInfo();
  const isInitialized = useRef(false); // Ref to track if Redux state has been initialized

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg text-foreground">Personal Information</h2>
        <SaveIndicator isSaving={saving} hasError={error} errorMessage={error} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-muted-foreground mb-2 flex items-center">
            <FaUser className="mr-2 text-gray-500" />
            Full Name *
          </label>
          <input
            type="text"
            name="full_name"
            value={formDataRedux?.full_name || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
            placeholder="e.g., John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2 flex items-center">
            <FaBriefcase className="mr-2 text-gray-500" />
            Professional Title *
          </label>
          <input
            type="text"
            name="professional_title"
            value={formDataRedux?.professional_title || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
            placeholder="e.g., Software Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2 flex items-center">
            <FaEnvelope className="mr-2 text-gray-500" />
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formDataRedux?.email || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
            placeholder="john.doe@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2 flex items-center">
            <FaPhone className="mr-2 text-gray-500" />
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formDataRedux?.phone || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
            placeholder="+1 123-456-7890"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-muted-foreground mb-2 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-500" />
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formDataRedux?.location || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input text-foreground"
            placeholder="e.g., New York, NY, USA"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationStep;
