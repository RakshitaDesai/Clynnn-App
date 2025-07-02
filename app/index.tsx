import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Animated,
  Easing,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { session, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Check authentication status after loading completes
    if (!loading) {
      if (session) {
        // User is signed in, redirect to tabs
        router.replace('/(tabs)/home');
        return;
      }
      
      // User is not signed in, show landing page with animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, session]);

  const handleGetStarted = () => {
    router.push('/auth/signup-email');
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={theme.background}
          locations={theme.backgroundLocations}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.loadingContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.logoWrapper}>
            <Text style={[styles.logoText, { color: theme.text }]}>Clynnn</Text>
            <View style={[styles.logoAccent, { backgroundColor: theme.primary }]} />
          </View>
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.background}
        locations={theme.backgroundLocations}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View 
            key={i}
            style={[
              styles.patternDot,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                backgroundColor: theme.primary + '4D',
              }
            ]}
          />
        ))}
      </View>

      <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          <View style={styles.logoWrapper}>
            <Text style={[styles.logoText, { color: theme.text }]}>Clynnn</Text>
            <View style={[styles.logoAccent, { backgroundColor: theme.primary }]} />
          </View>
          
          <View style={styles.taglineContainer}>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>Future of</Text>
            <Text style={[styles.taglineEmphasis, { color: theme.primary }]}>Waste Management</Text>
          </View>

          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Join the revolution in sustainable waste management. 
            Make a difference for our planet, one step at a time.
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.actionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGetStarted}
          >
            <LinearGradient
              colors={[theme.primary, theme.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={[styles.primaryButtonText, { color: theme.text }]}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color={theme.text} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleSignIn}
          >
            <View style={styles.secondaryButtonContent}>
              <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>Already have an account? Sign In</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Features Section */}
        <Animated.View 
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.feature}>
            <Ionicons name="leaf-outline" size={24} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>Eco-Friendly</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="trending-up-outline" size={24} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>Smart Analytics</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="people-outline" size={24} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>Community Driven</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  patternDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    letterSpacing: -1.5,
    textShadowColor: 'rgba(76, 175, 80, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  logoAccent: {
    position: 'absolute',
    bottom: -8,
    width: 60,
    height: 3,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-light',
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 4,
  },
  taglineEmphasis: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonContent: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    marginTop: 24,
  },
});