import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';
import memberService from 'services/memberService';

const SuccessMessage = ({ memberData, onClose }) => {
  const [downloadStatus, setDownloadStatus] = useState('pending');
  const [downloadError, setDownloadError] = useState(null);

  // Use localStorage data as fallback if memberData is incomplete
  const name = memberData.name || localStorage.getItem('member_name') || 'Member';
  const village = memberData.village || localStorage.getItem('member_village') || 'Not provided';
  const phoneNumber = memberData.phoneNumber || localStorage.getItem('member_phone') || '0000000000';
  
  // Use the real application ID if available from the backend
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const applicationId = memberData.applicationId || `RKM${timestamp}${random}`;

  // Clean up localStorage after successful registration and download PDF automatically
  useEffect(() => {
    // Auto-download PDF receipt
    const downloadReceipt = async () => {
      try {
        setDownloadStatus('downloading');
        await memberService.downloadApplicationReceipt({
          ...memberData,
          name,
          village,
          phoneNumber,
          applicationId,
          membershipType: 'General Member'
        });
        setDownloadStatus('completed');
      } catch (error) {
        console.error('Error downloading receipt:', error);
        setDownloadStatus('failed');
        setDownloadError(error.message || 'Failed to download receipt');
      }
    };

    downloadReceipt();

    return () => {
      // Clean up localStorage when component unmounts
      localStorage.removeItem('member_name');
      localStorage.removeItem('member_village');
      localStorage.removeItem('member_phone');
    };
  }, []);

  const handleDownloadCertificate = async () => {
    try {
      setDownloadStatus('downloading');
      await memberService.downloadApplicationReceipt({
        ...memberData,
        name,
        village,
        phoneNumber,
        applicationId,
        membershipType: 'General Member'
      });
      setDownloadStatus('completed');
      setDownloadError(null);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setDownloadStatus('failed');
      setDownloadError(error.message || 'Failed to download receipt');
    }
  };

  const handleJoinWhatsApp = () => {
    // Open WhatsApp with a predefined message
    window.open('https://wa.me/+911234567890?text=Hello, I just registered as a member with ID: ' + applicationId, '_blank');
  };

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto animate-scale-in">
        <Icon name="CheckCircle" size={40} color="white" />
      </div>

      {/* Success Message */}
      <div>
        <h3 className="text-2xl font-heading font-bold text-text-primary mb-2">
          Registration Successful!
        </h3>
        <p className="text-text-secondary mb-6">
          Your application has been submitted and is pending review. You will receive updates on your registered mobile number.
        </p>
      </div>

      {/* Membership ID */}
      <div className="bg-accent bg-opacity-30 p-6 rounded-lg">
        <div className="mb-4">
          <p className="text-text-secondary text-sm">Your Application ID</p>
          <p className="text-primary text-xl font-bold">{applicationId}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-text-secondary text-xs">Name</p>
            <p className="font-medium">{name}</p>
          </div>
          <div>
            <p className="text-text-secondary text-xs">Village/City</p>
            <p className="font-medium">{village}</p>
          </div>
          <div>
            <p className="text-text-secondary text-xs">Phone Number</p>
            <p className="font-medium">+91 {phoneNumber}</p>
          </div>
          <div>
            <p className="text-text-secondary text-xs">Status</p>
            <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-warning text-white text-xs">
              <Icon name="Clock" size={12} />
              <span>{memberData.status || 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Status */}
      {downloadStatus === 'downloading' && (
        <div className="flex items-center justify-center space-x-2 text-text-secondary">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
          <span>Downloading your application receipt...</span>
        </div>
      )}

      {downloadStatus === 'completed' && (
        <div className="flex items-center justify-center space-x-2 text-success">
          <Icon name="CheckCircle" size={16} />
          <span>Application receipt downloaded successfully!</span>
        </div>
      )}

      {downloadStatus === 'failed' && (
        <div className="flex items-center justify-center space-x-2 text-error">
          <Icon name="AlertCircle" size={16} />
          <span>{downloadError || 'Failed to download receipt. Please try again.'}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleDownloadCertificate}
          className={`flex-1 flex items-center justify-center space-x-2 ${
            downloadStatus === 'downloading' 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'btn-outline'
          }`}
          disabled={downloadStatus === 'downloading'}
        >
          {downloadStatus === 'downloading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Icon name="Download" size={18} />
              <span>Download Receipt</span>
            </>
          )}
        </button>

        <button 
          onClick={handleJoinWhatsApp}
          className="flex-1 flex items-center justify-center space-x-2 bg-[#25D366] text-white px-4 py-3 rounded-md font-medium hover:bg-opacity-90 transition-smooth"
        >
          <Icon name="MessageCircle" size={18} />
          <span>Join WhatsApp Group</span>
        </button>
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="btn-primary w-full"
      >
        Return to Homepage
      </button>

      {/* Help Text */}
      <p className="text-sm text-text-secondary">
        Need help? Contact us at{' '}
        <a href="tel:+911234567890" className="text-primary hover:underline">
          +91 12345 67890
        </a>
      </p>
    </div>
  );
};

export default SuccessMessage;