import React, { createContext, useContext, useState } from 'react';

export interface SignupData {
  // Email and password from first step
  email: string;
  password: string;
  
  // Personal details from second step
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  isHeadOfHousehold?: boolean;
  
  // House management
  houseId?: string;
  existingHouseId?: string; // For joining existing house
  
  // Verification status
  verificationStatus?: 'pending' | 'verified' | 'skipped';
  verificationData?: any;
}

interface SignupContextType {
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
  clearSignupData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
  });
  const [currentStep, setCurrentStep] = useState(1);

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };

  const clearSignupData = () => {
    setSignupData({
      email: '',
      password: '',
    });
    setCurrentStep(1);
  };

  const value: SignupContextType = {
    signupData,
    updateSignupData,
    clearSignupData,
    currentStep,
    setCurrentStep,
  };

  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  );
};