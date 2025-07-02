import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useSignup } from '../../context/SignupContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';


export default function SignUpVerification() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { signupData, updateSignupData, clearSignupData } = useSignup();
  const { signUp } = useAuth();
  const { showError, showSuccess, showInfo, showWarning } = useToast();
  
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'connecting' | 'verifying' | 'success' | 'error' | 'skipping' | 'completing'>('idle');
  const [userDocuments, setUserDocuments] = useState<any>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (verificationStatus === 'connecting' || verificationStatus === 'verifying' || verificationStatus === 'skipping' || verificationStatus === 'completing') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [verificationStatus, pulseAnim]);

  const handleDigilockerVerification = async () => {
    try {
      setVerificationStatus('connecting');
      showInfo('Connecting to DigiLocker', 'Establishing secure connection...');
      
      // Simulate Digilocker API integration
      // In a real app, you would integrate with Digilocker APIs here
      // https://www.digilocker.gov.in/assets/api/digilocker_api_doc.pdf
      
      // For demonstration, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStatus('verifying');
      showInfo('Verifying Documents', 'Fetching and verifying your documents...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful verification with sample data
      const mockUserData = {
        name: 'Navyansh Kesarwani',
        aadhaar: '****-****-1234',
        pan: 'ABCDE1234F',
        dateOfBirth: '01/01/1990',
        address: '123 Sample Street, Kanpur, Uttar Pradesh - 208025',
        verified: true
      };
      
      setUserDocuments(mockUserData);
      setVerificationStatus('success');
      showSuccess('Verification Successful!', 'Your identity has been verified successfully.');
      
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      showError(
        'Verification Failed',
        'Unable to verify your identity. Please try again or contact support.'
      );
    }
  };

  const handleManualVerification = () => {
    showWarning(
      'Manual Verification', 
      'This feature will be available soon. Please use DigiLocker for now.',
      6000
    );
  };

  const handleCompleteSignup = async () => {
    try {
      setVerificationStatus('completing');
      showInfo('Creating Account', 'Please wait while we set up your account...');
      
      // Complete signup with Supabase
      const { user, session } = await signUp(
        signupData.email,
        signupData.password,
        {
          fullName: signupData.fullName,
          dateOfBirth: signupData.dateOfBirth,
          gender: signupData.gender,
          isHeadOfHousehold: signupData.isHeadOfHousehold,
          existingHouseId: signupData.existingHouseId,
        }
      );
      
      if (user) {
        // Update verification status
        updateSignupData({ verificationStatus: 'verified' });
        
        showSuccess(
          'Account Created Successfully!',
          'Please check your email to verify your account.',
          5000
        );
        
        // Clear signup data
        clearSignupData();
        
        // Navigate to OTP verification screen
        setTimeout(() => {
          router.replace({
            pathname: '/auth/otp-verification',
            params: { email: signupData.email }
          });
        }, 2000);
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error: any) {
      setVerificationStatus('error');
      showError(
        'Account Creation Failed',
        error.message || 'Unable to create your account. Please try again.'
      );
    }
  };

  const handleSkipVerification = async () => {
    try {
      setVerificationStatus('skipping');
      showInfo('Creating Account', 'Please wait while we set up your account...');
      
      // Complete signup with Supabase without verification
      const { user, session } = await signUp(
        signupData.email,
        signupData.password,
        {
          fullName: signupData.fullName,
          dateOfBirth: signupData.dateOfBirth,
          gender: signupData.gender,
          isHeadOfHousehold: signupData.isHeadOfHousehold,
          existingHouseId: signupData.existingHouseId,
        }
      );
      
      if (user) {
        // Update verification status as skipped
        updateSignupData({ verificationStatus: 'skipped' });
        
        showInfo(
          'Account Created',
          'Please check your email to verify your account.',
          4000
        );
        
        // Clear signup data
        clearSignupData();
        
        // Navigate to OTP verification screen
        setTimeout(() => {
          router.replace({
            pathname: '/auth/otp-verification',
            params: { email: signupData.email }
          });
        }, 1500);
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error: any) {
      setVerificationStatus('error');
      showError(
        'Account Creation Failed',
        error.message || 'Unable to create your account. Please try again.'
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderVerificationStep = () => {
    switch (verificationStatus) {
      case 'idle':
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark-outline" size={64} color={theme.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Verify Your Identity</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              We need to verify your identity to ensure security and compliance. 
              Choose one of the methods below to proceed.
            </Text>
            
            <View style={styles.methodsContainer}>
              <TouchableOpacity 
                style={styles.methodButton}
                onPress={handleDigilockerVerification}
              >
                <LinearGradient
                  colors={[theme.primary, theme.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.methodButtonGradient}
                >
                  <View style={styles.methodButtonContent}>
                    <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
                    <View style={styles.methodTextContainer}>
                      <Text style={styles.methodTitle}>DigiLocker</Text>
                      <Text style={styles.methodSubtitle}>Quick & Secure</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.methodButtonSecondary, { borderColor: `${theme.primary}50` }]}
                onPress={handleManualVerification}
              >
                <LinearGradient
                  colors={['transparent', 'transparent']}
                  style={[styles.methodButtonSecondaryGradient, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.surface[0] }]}
                >
                  <View style={styles.methodButtonContent}>
                    <Ionicons name="cloud-upload-outline" size={24} color={theme.primary} />
                    <View style={styles.methodTextContainer}>
                      <Text style={[styles.methodTitleSecondary, { color: theme.primary }]}>Manual Upload</Text>
                      <Text style={[styles.methodSubtitleSecondary, { color: theme.textSecondary }]}>Upload documents</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={20} color={theme.primary} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Skip Button */}
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkipVerification}
            >
              <Text style={[styles.skipButtonText, { color: theme.textTertiary }]}>Skip for now</Text>
            </TouchableOpacity>
          </Animated.View>
        );

      case 'connecting':
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="link-outline" size={64} color={theme.primary} />
            </Animated.View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Connecting to DigiLocker</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Establishing secure connection with DigiLocker services...
            </Text>
            <View style={styles.loadingDots}>
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
            </View>
          </Animated.View>
        );

      case 'verifying':
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="scan-outline" size={64} color={theme.primary} />
            </Animated.View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Verifying Documents</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Fetching and verifying your documents from DigiLocker...
            </Text>
            <View style={styles.loadingDots}>
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
            </View>
          </Animated.View>
        );

      case 'success':
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={64} color={theme.success} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Verification Successful!</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Your identity has been successfully verified.
            </Text>
            
            {userDocuments && (
              <View style={[styles.documentsContainer, { 
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.surface[0],
                borderColor: theme.border
              }]}>
                <Text style={[styles.documentsTitle, { color: theme.primary }]}>Verified Information:</Text>
                <View style={styles.documentItem}>
                  <Text style={[styles.documentLabel, { color: theme.textSecondary }]}>Name:</Text>
                  <Text style={[styles.documentValue, { color: theme.text }]}>{userDocuments.name}</Text>
                </View>
                <View style={styles.documentItem}>
                  <Text style={[styles.documentLabel, { color: theme.textSecondary }]}>Aadhaar:</Text>
                  <Text style={[styles.documentValue, { color: theme.text }]}>{userDocuments.aadhaar}</Text>
                </View>
                <View style={styles.documentItem}>
                  <Text style={[styles.documentLabel, { color: theme.textSecondary }]}>Date of Birth:</Text>
                  <Text style={[styles.documentValue, { color: theme.text }]}>{userDocuments.dateOfBirth}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleCompleteSignup}
            >
              <LinearGradient
                colors={[theme.primary, theme.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.completeButtonGradient}
              >
                <Text style={styles.completeButtonText}>Complete Sign Up</Text>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        );

      case 'skipping':
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="person-add-outline" size={64} color={theme.primary} />
            </Animated.View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Creating Your Account</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Setting up your account without verification. You can verify later.
            </Text>
            <View style={styles.loadingDots}>
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
            </View>
          </Animated.View>
        );

      case 'completing':
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="checkmark-done-outline" size={64} color={theme.primary} />
            </Animated.View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Finalizing Account</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Creating your verified account with identity confirmation.
            </Text>
            <View style={styles.loadingDots}>
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
            </View>
          </Animated.View>
        );

      case 'error':
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <View style={styles.iconContainer}>
              <Ionicons name="alert-circle-outline" size={64} color={theme.error} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Verification Failed</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              We couldn't verify your identity. Please try again or use manual verification.
            </Text>
            
            <TouchableOpacity 
              style={[styles.retryButton, { 
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.surface[0],
                borderColor: `${theme.error}50`
              }]}
              onPress={() => setVerificationStatus('idle')}
            >
              <Text style={[styles.retryButtonText, { color: theme.error }]}>Try Again</Text>
            </TouchableOpacity>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={theme.background}
        locations={theme.backgroundLocations}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.backgroundElements}>
        <View style={[styles.floatingElement, styles.element1, { backgroundColor: theme.primaryLight, opacity: isDark ? 0.1 : 0.05 }]} />
        <View style={[styles.floatingElement, styles.element2, { backgroundColor: theme.primary, opacity: isDark ? 0.1 : 0.05 }]} />
        <View style={[styles.floatingElement, styles.element3, { backgroundColor: theme.primaryLight, opacity: isDark ? 0.1 : 0.05 }]} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={[styles.title, { color: theme.text }]}>Identity Verification</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Final step to secure your account
            </Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, { backgroundColor: theme.primary }]} />
              <View style={[styles.progressStep, { backgroundColor: theme.primary }]} />
              <View style={[styles.progressStep, { backgroundColor: theme.primary }]} />
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {renderVerificationStep()}

            {verificationStatus === 'idle' && (
              <View style={styles.buttonContainer}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity 
                    style={[styles.button, styles.backButton, { borderColor: `${theme.primary}50` }]}
                    onPress={handleBack}
                  >
                    <View style={styles.backButtonContent}>
                      <Ionicons name="arrow-back" size={20} color={theme.primary} />
                      <Text style={[styles.backButtonText, { color: theme.primary }]}>Back</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  element1: {
    width: 200,
    height: 200,
    top: '10%',
    right: '-20%',
  },
  element2: {
    width: 150,
    height: 150,
    bottom: '20%',
    left: '-15%',
  },
  element3: {
    width: 100,
    height: 100,
    top: '60%',
    right: '10%',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  progressStep: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  formContainer: {
    flex: 1,
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  methodsContainer: {
    width: '100%',
    gap: 16,
  },
  methodButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  methodButtonSecondary: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  methodButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  methodButtonSecondaryGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  methodButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 4,
  },
  methodTitleSecondary: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  methodSubtitleSecondary: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  documentsContainer: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    width: '100%',
    borderWidth: 1,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  documentLabel: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  documentValue: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '500',
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 20,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  retryButton: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 20,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 40,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});