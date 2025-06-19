import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RegistrationForm = ({ formData, errors, onComplete, setErrors, isLoading }) => {
  const [localData, setLocalData] = useState({
    name: formData.name || '',
    village: formData.village || '',
    phoneNumber: formData.phoneNumber || '',
    age: formData.age || '',
    education: formData.education || '',
    experience: formData.experience || '',
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

    if (!localData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(localData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!localData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (parseInt(localData.age) < 18 || parseInt(localData.age) > 35) {
      newErrors.age = 'Age must be between 18 and 35 years';
    }

    if (!localData.education.trim()) {
      newErrors.education = 'Education information is required';
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
          Village/City *
        </label>
        <input
          type="text"
          value={localData.village}
          onChange={(e) => handleInputChange('village', e.target.value)}
          className={`form-input ${errors.village ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder="Enter your village or city name"
          disabled={isLoading}
        />
        {errors.village && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.village}
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
        <p className="mt-1 text-xs text-text-secondary">
          We'll send an OTP to verify your mobile number
        </p>
      </div>
      
      {/* Age Field */}
      <div>
        <label className="form-label">
          <Icon name="Calendar" size={16} className="inline mr-2" />
          Age *
        </label>
        <input
          type="number"
          min="18"
          max="35"
          value={localData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className={`form-input ${errors.age ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder="Age (18-35)"
          disabled={isLoading}
        />
        {errors.age && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.age}
          </p>
        )}
      </div>

      {/* Education Field */}
      <div>
        <label className="form-label">
          <Icon name="BookOpen" size={16} className="inline mr-2" />
          Education *
        </label>
        <input
          type="text"
          value={localData.education}
          onChange={(e) => handleInputChange('education', e.target.value)}
          className={`form-input ${errors.education ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder="Highest educational qualification"
          disabled={isLoading}
        />
        {errors.education && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.education}
          </p>
        )}
      </div>

      {/* Experience Field */}
      <div>
        <label className="form-label">
          <Icon name="Briefcase" size={16} className="inline mr-2" />
          Agriculture Experience
        </label>
        <textarea
          value={localData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className={`form-input ${errors.experience ? 'border-error focus:border-error focus:ring-error' : ''}`}
          placeholder="Describe your experience in agriculture (if any)"
          rows={3}
          disabled={isLoading}
        />
        {errors.experience && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.experience}
          </p>
        )}
      </div>

      {/* Program Information */}
      <div className="bg-accent bg-opacity-20 p-4 rounded-lg">
        <h3 className="font-medium text-primary mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2" />
          Youth Leadership Program Details
        </h3>
        <ul className="text-sm text-text-secondary space-y-2">
          <li className="flex items-start">
            <Icon name="Check" size={14} className="text-success mr-2 mt-1" />
            <span>Open to youth aged 18-35 interested in agricultural leadership</span>
          </li>
          <li className="flex items-start">
            <Icon name="Check" size={14} className="text-success mr-2 mt-1" />
            <span>6-month program with monthly workshops and mentorship</span>
          </li>
          <li className="flex items-start">
            <Icon name="Check" size={14} className="text-success mr-2 mt-1" />
            <span>Covers agricultural innovation, community organizing, and entrepreneurship</span>
          </li>
          <li className="flex items-start">
            <Icon name="Check" size={14} className="text-success mr-2 mt-1" />
            <span>Selected participants receive full scholarship and stipend</span>
          </li>
        </ul>
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
            of the Youth Leadership Program
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
          Questions about the program? Contact us at{' '}
          <a href="tel:+911234567890" className="text-primary hover:underline">
            +91 12345 67890
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;