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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useSignup } from '../../context/SignupContext';
import { useToast } from '../../context/ToastContext';
import { houseService } from '../../lib/houses';

const { width, height } = Dimensions.get('window');

export default function SignUpPersonal() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { signupData, updateSignupData, setCurrentStep } = useSignup();
  const { showError, showSuccess } = useToast();
  
  const [fullName, setFullName] = useState(signupData.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(signupData.dateOfBirth || '');
  const [gender, setGender] = useState(signupData.gender || '');
  const [isHeadOfHousehold, setIsHeadOfHousehold] = useState<boolean | null>(signupData.isHeadOfHousehold ?? null);
  const [existingHouseId, setExistingHouseId] = useState(signupData.existingHouseId || '');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingHouseId, setValidatingHouseId] = useState(false);
  const [houseIdValid, setHouseIdValid] = useState<boolean | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const genderOptions = ['Male', 'Female', 'Prefer not to say'];

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

  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('/');
    }
    return text;
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    setDateOfBirth(formatted);
  };

  const renderInput = (
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    icon: string,
    keyboardType?: any,
    inputKey?: string,
    editable?: boolean,
    onPress?: () => void
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
        <TouchableOpacity 
          style={[styles.inputWrapper, { 
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.surface[0], 
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : theme.borderLight 
          }]}
          onPress={onPress}
          disabled={!onPress}
          activeOpacity={onPress ? 0.7 : 1}
        >
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
            autoCapitalize={inputKey === 'fullName' ? 'words' : 'none'}
            onFocus={() => setFocusedInput(inputKey || null)}
            onBlur={() => setFocusedInput(null)}
            selectionColor={theme.primary}
            editable={editable !== false}
            pointerEvents={onPress ? 'none' : 'auto'}
          />
          {onPress && (
            <Ionicons
              name="chevron-down"
              size={20}
              color={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}
            />
          )}
        </TouchableOpacity>
        {isFocused && <View style={[styles.inputUnderline, { backgroundColor: theme.primary }]} />}
      </Animated.View>
    );
  };

  const renderToggleOption = (
    title: string,
    subtitle: string,
    value: boolean | null,
    onPress: (value: boolean) => void
  ) => {
    return (
      <Animated.View 
        style={[
          styles.toggleContainer,
          { 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }],
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.surface[0],
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : theme.borderLight
          }
        ]}
      >
        <View style={styles.toggleHeader}>
          <Text style={[styles.toggleTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.toggleSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        </View>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { 
                backgroundColor: value === true ? `${theme.primary}20` : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
                borderColor: value === true ? theme.primary : theme.borderLight
              }
            ]}
            onPress={() => onPress(true)}
          >
            <Text style={[
              styles.toggleButtonText,
              { color: value === true ? theme.primary : theme.textSecondary }
            ]}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { 
                backgroundColor: value === false ? `${theme.primary}20` : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
                borderColor: value === false ? theme.primary : theme.borderLight
              }
            ]}
            onPress={() => onPress(false)}
          >
            <Text style={[
              styles.toggleButtonText,
              { color: value === false ? theme.primary : theme.textSecondary }
            ]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const handleContinue = async () => {
    if (loading) return;
    
    // Basic validation
    if (!fullName || !dateOfBirth || !gender || isHeadOfHousehold === null) {
      showError('Missing Information', 'Please fill in all fields.');
      return;
    }
    
    // If not head of household, validate house ID
    if (isHeadOfHousehold === false) {
      if (!existingHouseId) {
        showError('House ID Required', 'Please enter a house ID to join an existing household.');
        return;
      }
      if (!houseService.isValidHouseCode(existingHouseId)) {
        showError('Invalid House ID', 'Please enter a valid house ID format (e.g., ECO-2024-ABC123).');
        return;
      }
      if (houseIdValid === false) {
        showError('House Not Found', 'The house ID you entered does not exist.');
        return;
      }
    }
    
    try {
      setLoading(true);
      
      // Store personal details in signup context
      updateSignupData({
        fullName,
        dateOfBirth,
        gender,
        isHeadOfHousehold,
        existingHouseId: isHeadOfHousehold === false ? existingHouseId : undefined,
      });
      setCurrentStep(3);
      
      // Navigate to verification screen
      router.push('/auth/signup-verification');
      
    } catch (error: any) {
      showError('Error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleHouseIdChange = async (text: string) => {
    setExistingHouseId(text.toUpperCase());
    setHouseIdValid(null);
    
    // Only validate if the format is correct
    if (text && houseService.isValidHouseCode(text)) {
      setValidatingHouseId(true);
      try {
        const house = await houseService.getHouseByCode(text);
        setHouseIdValid(house !== null);
      } catch (error) {
        setHouseIdValid(false);
      } finally {
        setValidatingHouseId(false);
      }
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
            <Text style={[styles.title, { color: theme.text }]}>Personal Details</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Tell us a bit about yourself
            </Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, { backgroundColor: theme.primary }]} />
              <View style={[styles.progressStep, { backgroundColor: theme.primary }]} />
              <View style={[styles.progressStep, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }]} />
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
            {renderInput(
              'Full Name',
              fullName,
              setFullName,
              'person-outline',
              'default',
              'fullName'
            )}

            {renderInput(
              'Date of Birth (MM/DD/YYYY)',
              dateOfBirth,
              handleDateChange,
              'calendar-outline',
              'numeric',
              'dateOfBirth'
            )}

            {renderInput(
              'Gender',
              gender,
              () => {},
              'body-outline',
              'default',
              'gender',
              false,
              () => setShowGenderPicker(true)
            )}

            {renderToggleOption(
              'Head of Household',
              'Are you the primary decision maker for your household?',
              isHeadOfHousehold,
              (value) => {
                setIsHeadOfHousehold(value);
                if (value === true) {
                  setExistingHouseId('');
                  setHouseIdValid(null);
                }
              }
            )}

            {/* House ID input for non-heads */}
            {isHeadOfHousehold === false && (
              <Animated.View 
                style={[
                  styles.houseIdContainer,
                  { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                ]}
              >
                <Text style={[styles.houseIdTitle, { color: theme.text }]}>Join Existing Household</Text>
                <Text style={[styles.houseIdSubtitle, { color: theme.textSecondary }]}>Enter the house ID shared by your family</Text>
                
                {renderInput(
                  'House ID (e.g., ECO-2024-ABC123)',
                  existingHouseId,
                  handleHouseIdChange,
                  'home-outline',
                  'default',
                  'houseId'
                )}
                
                {existingHouseId && (
                  <View style={styles.houseIdValidation}>
                    {validatingHouseId ? (
                      <View style={styles.validationLoading}>
                        <Text style={[styles.validationText, { color: theme.textSecondary }]}>Validating house ID...</Text>
                      </View>
                    ) : houseIdValid === true ? (
                      <View style={styles.validationSuccess}>
                        <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                        <Text style={[styles.validationText, { color: theme.success }]}>House found! You can join this household.</Text>
                      </View>
                    ) : houseIdValid === false ? (
                      <View style={styles.validationError}>
                        <Ionicons name="close-circle" size={16} color={theme.error} />
                        <Text style={[styles.validationText, { color: theme.error }]}>House not found. Please check the ID.</Text>
                      </View>
                    ) : null}
                  </View>
                )}
              </Animated.View>
            )}

            {/* New house info for heads */}
            {isHeadOfHousehold === true && (
              <Animated.View 
                style={[
                  styles.newHouseContainer,
                  { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                ]}
              >
                <View style={[styles.newHouseInfo, { backgroundColor: isDark ? 'rgba(102, 187, 106, 0.1)' : theme.surface[0], borderColor: theme.border }]}>
                  <Ionicons name="home" size={24} color={theme.primary} />
                  <View style={styles.newHouseText}>
                    <Text style={[styles.newHouseTitle, { color: theme.text }]}>Creating New Household</Text>
                    <Text style={[styles.newHouseSubtitle, { color: theme.textSecondary }]}>A unique house ID will be generated for your family</Text>
                  </View>
                </View>
              </Animated.View>
            )}

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

              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity 
                  style={[styles.continueButton, loading && { opacity: 0.7 }]}
                  onPress={handleContinue}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[theme.primary, theme.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.continueButtonGradient}
                  >
                    <Text style={styles.continueButtonText}>
                      {loading ? 'Please wait...' : 'Continue'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1B5E20' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Gender</Text>
              <TouchableOpacity
                onPress={() => setShowGenderPicker(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: gender === option ? `${theme.primary}20` : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)'),
                      borderColor: gender === option ? theme.primary : theme.borderLight
                    }
                  ]}
                  onPress={() => {
                    setGender(option);
                    setShowGenderPicker(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    { color: gender === option ? theme.primary : theme.text }
                  ]}>
                    {option}
                  </Text>
                  {gender === option && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#66BB6A',
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
  toggleContainer: {
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleHeader: {
    marginBottom: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    lineHeight: 18,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(102, 187, 106, 0.2)',
    borderColor: '#66BB6A',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  toggleButtonTextActive: {
    color: '#66BB6A',
    fontWeight: '600',
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
    borderColor: 'rgba(102, 187, 106, 0.3)',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#66BB6A',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  continueButton: {
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1B5E20',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  modalCloseButton: {
    padding: 4,
  },
  optionsContainer: {
    padding: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(102, 187, 106, 0.2)',
    borderColor: '#66BB6A',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '400',
  },
  optionTextSelected: {
    color: '#66BB6A',
    fontWeight: '600',
  },
  houseIdContainer: {
    marginBottom: 30,
  },
  houseIdTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 4,
  },
  houseIdSubtitle: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    lineHeight: 18,
    marginBottom: 16,
  },
  houseIdValidation: {
    marginTop: 8,
  },
  validationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  validationError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  validationText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  newHouseContainer: {
    marginBottom: 30,
  },
  newHouseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  newHouseText: {
    flex: 1,
    marginLeft: 12,
  },
  newHouseTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 2,
  },
  newHouseSubtitle: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    lineHeight: 16,
  },
});