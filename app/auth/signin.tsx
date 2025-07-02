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
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function SignIn() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { signIn } = useAuth();
  const { showError, showSuccess } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSignIn = async () => {
    if (loading) return;
    
    // Basic validation
    if (!email || !password) {
      showError('Missing Information', 'Please enter both email and password.');
      return;
    }
    
    try {
      setLoading(true);
      
      const { user, session } = await signIn(email, password);
      
      if (user && session) {
        showSuccess('Welcome Back!', 'You have been successfully signed in.');
        
        // Navigate to main app
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1000);
      } else {
        throw new Error('Sign in failed');
      }
    } catch (error: any) {
      console.log('Sign in error:', error);
      
      // Handle email not confirmed error
      if (error.message && error.message.includes('Email not confirmed')) {
        showError(
          'Email Not Verified',
          'Please verify your email address first.',
          6000
        );
        
        // Navigate to OTP verification with email
        setTimeout(() => {
          router.push({
            pathname: '/auth/otp-verification',
            params: { email: email }
          });
        }, 2000);
      } else {
        showError(
          'Sign In Failed', 
          error.message || 'Invalid email or password. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
            autoCapitalize="none"
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
            <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Sign in to continue your eco-journey
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

            <Animated.View style={[styles.forgotPasswordContainer, { opacity: fadeAnim }]}>
              <TouchableOpacity>
                <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity 
                style={[styles.signInButton, loading && { opacity: 0.7 }]}
                onPress={handleSignIn}
                disabled={loading}
              >
                <LinearGradient
                  colors={[theme.primary, theme.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signInButtonGradient}
                >
                  <Text style={styles.signInButtonText}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

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

            <Animated.View 
              style={[
                styles.signUpContainer,
                { opacity: fadeAnim }
              ]}
            >
              <Text style={[styles.signUpText, { color: theme.textSecondary }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/auth/signup-email')}>
                <Text style={[styles.signUpLink, { color: theme.primary }]}>Create Account</Text>
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
    marginTop: 80,
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
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    paddingVertical: 18,
    fontWeight: '400',
  },
  inputUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    borderRadius: 1,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '500',
  },
  signInButton: {
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  signInButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  signInButtonText: {
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
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 14,
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
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '400',
  },
  signUpLink: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
  },
});