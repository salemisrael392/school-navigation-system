import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0c1c2f] flex flex-col w-full relative selection:bg-blue-100 selection:text-blue-900">
      {children}
    </div>
  );
};

