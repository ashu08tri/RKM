import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RegistrationForm = ({ formData, errors, onComplete, setErrors, isLoading }) => {
  const [localData, setLocalData] = useState({
    name: formData.name || '',
    village: formData.village || '',
    city: formData.city || '',
    phoneNumber: formData.phoneNumber || '',
    termsAccepted: formData.termsAccepted || false
  });  

  const validateForm = () => {
    const newErrors = {};

    if (!localData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (localData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!localData.village.trim()) {
      newErrors.village = 'Village name is required';
    }

    if (!localData.city.trim()) {
      newErrors.city = 'City name is required';
    }

    if (!localData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(localData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!localData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onComplete(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="form-label">
          <Icon name="User" size={16} className="inline mr-2" />
          Full Name *
        </label>
        <input
          type="text"
          value={localData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`form-input ${errors.name ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder="Enter your full name"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Village Field */}
      <div>
        <label className="form-label">
          <Icon name="MapPin" size={16} className="inline mr-2" />
          Village *
        </label>
        <input
          type="text"
          value={localData.village}
          onChange={(e) => handleInputChange('village', e.target.value)}
          className={`form-input ${errors.village ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder="Enter your village name"
          disabled={isLoading}
        />
        {errors.village && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.village}
          </p>
        )}
      </div>

      {/* City Field */}
      <div>
        <label className="form-label">
          <Icon name="MapPin" size={16} className="inline mr-2" />
          City *
        </label>
        <input
          type="text"
          value={localData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          className={`form-input ${errors.city ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder="Enter your city name"
          disabled={isLoading}
        />
        {errors.city && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.city}
          </p>
        )}
      </div>

      {/* Phone Number Field */}
      <div>
        <label className="form-label">
          <Icon name="Phone" size={16} className="inline mr-2" />
          Mobile Number *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-text-secondary text-sm">+91</span>
          </div>
          <input
            type="tel"
            value={localData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
            className={`form-input pl-12 ${errors.phoneNumber ? 'border-error focus:border-error focus:ring-error' : ''}`}
            placeholder="Enter 10-digit mobile number"
            disabled={isLoading}
          />
        </div>
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.phoneNumber}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.termsAccepted}
            onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
            className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-offset-0"
            disabled={isLoading}
          />
          <span className="text-sm text-text-secondary leading-relaxed">
            I agree to the{' '}
            <button type="button" className="text-primary hover:underline">
              Terms and Conditions
            </button>{' '}
            and{' '}
            <button type="button" className="text-primary hover:underline">
              Privacy Policy
            </button>{' '}
            of Kisan Andolan Portal
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.termsAccepted}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Icon name="ArrowRight" size={20} />
              <span>Continue to Verification</span>
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          Need help? Contact us at{' '}
          <a href="tel:+911234567890" className="text-primary hover:underline">
            +91 12345 67890
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;