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
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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

  const renderInput = (
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    icon: string,
    keyboardType?: any,
    secureTextEntry?: boolean,
    inputKey?: string
  ) => {
    const isFocused = focusedInput === inputKey;
    
    return (
      <Animated.View 
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          }
        ]}
      >
        <View style={[styles.inputWrapper, { 
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.surface[0], 
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : theme.borderLight 
        }]}>
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={isFocused ? theme.primary : isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder={placeholder}
            placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={inputKey === 'fullName' ? 'words' : 'none'}
            onFocus={() => setFocusedInput(inputKey || null)}
            onBlur={() => setFocusedInput(null)}
            selectionColor={theme.primary}
          />
          {inputKey === 'password' && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}
              />
            </TouchableOpacity>
          )}
          {inputKey === 'confirmPassword' && (
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}
              />
            </TouchableOpacity>
          )}
        </View>
        {isFocused && <View style={[styles.inputUnderline, { backgroundColor: theme.primary }]} />}
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

      {/* Background Elements */}
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
            <Text style={[styles.title, { color: theme.text }]}>
              {step === 1 ? 'Create Account' : 'Complete Profile'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {step === 1 
                ? 'Join the revolution in waste management' 
                : 'Fill in your details to get started'
              }
            </Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, { backgroundColor: step >= 1 ? theme.primary : (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)') }]} />
              <View style={[styles.progressStep, { backgroundColor: step >= 2 ? theme.primary : (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)') }]} />
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
            {step === 1 && (
              <>
                {renderInput(
                  'Full Name',
                  fullName,
                  setFullName,
                  'person-outline',
                  'default',
                  false,
                  'fullName'
                )}

                {renderInput(
                  'Email Address',
                  email,
                  setEmail,
                  'mail-outline',
                  'email-address',
                  false,
                  'email'
                )}

                {renderInput(
                  'Password',
                  password,
                  setPassword,
                  'lock-closed-outline',
                  'default',
                  !showPassword,
                  'password'
                )}

                {renderInput(
                  'Confirm Password',
                  confirmPassword,
                  setConfirmPassword,
                  'lock-closed-outline',
                  'default',
                  !showConfirmPassword,
                  'confirmPassword'
                )}
              </>
            )}

            {step === 2 && (
              <>
                {renderInput(
                  'Phone Number',
                  phone,
                  setPhone,
                  'call-outline',
                  'phone-pad',
                  false,
                  'phone'
                )}

                {renderInput(
                  'Address',
                  address,
                  setAddress,
                  'location-outline',
                  'default',
                  false,
                  'address'
                )}

                {renderInput(
                  'City',
                  city,
                  setCity,
                  'business-outline',
                  'default',
                  false,
                  'city'
                )}

                {renderInput(
                  'Zip Code',
                  zipCode,
                  setZipCode,
                  'map-outline',
                  'numeric',
                  false,
                  'zipCode'
                )}
              </>
            )}

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={() => {
                  if (step === 1) {
                    setStep(2);
                  } else {
                    // Handle account creation
                    console.log('Creating account...');
                  }
                }}
              >
                <LinearGradient
                  colors={[theme.primary, theme.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signUpButtonGradient}
                >
                  <Text style={styles.signUpButtonText}>
                    {step === 1 ? 'Continue' : 'Create Account'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {step === 2 && (
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity 
                  style={[styles.signUpButton, styles.backButton, { borderColor: `${theme.primary}50` }]}
                  onPress={() => setStep(1)}
                >
                  <View style={styles.backButtonContent}>
                    <Ionicons name="arrow-back" size={20} color={theme.primary} />
                    <Text style={[styles.backButtonText, { color: theme.primary }]}>Back</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}

            {step === 1 && (
              <>
                <Animated.View 
                  style={[
                    styles.dividerContainer,
                    { opacity: fadeAnim }
                  ]}
                >
                  <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
                  <Text style={[styles.dividerText, { color: theme.textTertiary }]}>or continue with</Text>
                  <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
                </Animated.View>

                <Animated.View 
                  style={[
                    styles.socialButtonsContainer,
                    { transform: [{ scale: scaleAnim }] }
                  ]}
                >
                  <TouchableOpacity style={[styles.socialButton, { borderColor: theme.borderLight }]}>
                    <LinearGradient
                      colors={theme.surface}
                      style={styles.socialButtonGradient}
                    >
                      <Ionicons name="logo-google" size={24} color={theme.text} />
                      <Text style={[styles.socialButtonText, { color: theme.text }]}>Google</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.socialButton, { borderColor: theme.borderLight }]}>
                    <LinearGradient
                      colors={theme.surface}
                      style={styles.socialButtonGradient}
                    >
                      <Ionicons name="logo-facebook" size={24} color={theme.text} />
                      <Text style={[styles.socialButtonText, { color: theme.text }]}>Facebook</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}

            <Animated.View 
              style={[
                styles.loginContainer,
                { opacity: fadeAnim }
              ]}
            >
              <Text style={[styles.loginText, { color: theme.textSecondary }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signin')}>
                <Text style={[styles.loginLink, { color: theme.primary }]}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>
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
    backgroundColor: '#66BB6A',
    top: '10%',
    right: '-20%',
  },
  element2: {
    width: 150,
    height: 150,
    backgroundColor: '#81C784',
    bottom: '20%',
    left: '-15%',
  },
  element3: {
    width: 100,
    height: 100,
    backgroundColor: '#66BB6A',
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
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  inputContainerFocused: {
    transform: [{ scale: 1.02 }],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    paddingVertical: 18,
    fontWeight: '400',
  },
  inputFocused: {
    color: '#FFFFFF',
  },
  inputUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#66BB6A',
    borderRadius: 1,
  },
  eyeIcon: {
    padding: 4,
  },
  signUpButton: {
    marginTop: 12,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  signUpButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '400',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  socialButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  socialButtonText: {
    marginLeft: 12,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '400',
  },
  loginLink: {
    fontSize: 14,
    color: '#66BB6A',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  progressStep: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#66BB6A',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginTop: 0,
    marginBottom: 20,
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
});