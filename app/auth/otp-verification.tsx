import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../lib/auth';

const { width } = Dimensions.get('window');

export default function OTPVerification() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { showError, showSuccess, showInfo } = useToast();
  const params = useLocalSearchParams();
  
  const email = params.email as string;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  const inputRefs = useRef<TextInput[]>([]);

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
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      showError('Invalid OTP', 'Please enter the complete 6-digit code.');
      shakeInputs();
      return;
    }

    try {
      setLoading(true);
      showInfo('Verifying...', 'Please wait while we verify your email.');
      
      const { data, error } = await authService.verifyOtp(email, otpCode);
      
      if (error) {
        throw error;
      }

      showSuccess('Email Verified!', 'Your email has been successfully verified.');
      
      // Navigate to signin screen
      setTimeout(() => {
        router.replace('/auth/signin');
      }, 1500);
      
    } catch (error: any) {
      showError('Verification Failed', error.message || 'Invalid or expired OTP code.');
      shakeInputs();
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setFocusedIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0) return;
    
    try {
      setResendLoading(true);
      showInfo('Sending OTP...', 'A new verification code is being sent to your email.');
      
      const { error } = await authService.resendOtp(email);
      
      if (error) {
        throw error;
      }

      showSuccess('OTP Sent!', 'A new verification code has been sent to your email.');
      setTimeLeft(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setFocusedIndex(0);
      
    } catch (error: any) {
      showError('Failed to Resend', error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderOtpInput = (value: string, index: number) => {
    const isFocused = focusedIndex === index;
    
    return (
      <Animated.View
        key={index}
        style={[
          styles.otpInputContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: shakeAnim }
            ],
          },
        ]}
      >
        <TextInput
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={[
            styles.otpInput,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.surface[0],
              borderColor: isFocused ? theme.primary : (isDark ? 'rgba(255, 255, 255, 0.1)' : theme.borderLight),
              color: theme.text,
            },
            isFocused && { borderWidth: 2 },
            value && { backgroundColor: `${theme.primary}10`, borderColor: theme.primary }
          ]}
          value={value}
          onChangeText={(text) => handleOtpChange(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          onFocus={() => setFocusedIndex(index)}
          keyboardType="numeric"
          maxLength={6} // Allow paste
          textAlign="center"
          selectionColor={theme.primary}
          editable={!loading}
        />
        {isFocused && !value && (
          <View style={[styles.cursor, { backgroundColor: theme.primary }]} />
        )}
      </Animated.View>
    );
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
            <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name="mail-outline" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Verify Your Email</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              We've sent a 6-digit verification code to
            </Text>
            <Text style={[styles.email, { color: theme.primary }]}>
              {email}
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Enter the code to verify your email address
            </Text>
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
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => renderOtpInput(digit, index))}
            </View>

            <View style={styles.resendContainer}>
              {timeLeft > 0 ? (
                <Text style={[styles.timerText, { color: theme.textSecondary }]}>
                  Resend code in {formatTime(timeLeft)}
                </Text>
              ) : (
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendOtp}
                  disabled={resendLoading}
                >
                  <Text style={[styles.resendText, { color: theme.primary }]}>
                    {resendLoading ? 'Sending...' : 'Resend Code'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity 
                  style={[styles.button, styles.backButton, { borderColor: `${theme.primary}50` }]}
                  onPress={handleBack}
                  disabled={loading}
                >
                  <View style={styles.backButtonContent}>
                    <Ionicons name="arrow-back" size={20} color={theme.primary} />
                    <Text style={[styles.backButtonText, { color: theme.primary }]}>Back</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity 
                  style={[styles.verifyButton, loading && { opacity: 0.7 }]}
                  onPress={handleVerifyOtp}
                  disabled={loading || otp.join('').length !== 6}
                >
                  <LinearGradient
                    colors={[theme.primary, theme.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.verifyButtonGradient}
                  >
                    <Text style={styles.verifyButtonText}>
                      {loading ? 'Verifying...' : 'Verify Email'}
                    </Text>
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  otpInputContainer: {
    position: 'relative',
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  cursor: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 2,
    height: 24,
    marginLeft: -1,
    marginTop: -12,
    opacity: 0.8,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  button: {
    flex: 1,
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
  verifyButton: {
    flex: 1,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
});