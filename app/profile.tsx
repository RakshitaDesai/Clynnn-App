import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { theme, themeMode, toggleTheme, isDark } = useTheme();
  const { signOut, user, session } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleOpenSidebar = () => {
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  const handleBack = () => {
    router.back();
  };

  const getThemeInfo = () => {
    switch (themeMode) {
      case 'light':
        return {
          title: 'Light Theme',
          description: 'Clean and bright interface',
          icon: 'sunny',
          color: '#FFA726',
        };
      case 'dark':
        return {
          title: 'Dark Theme',
          description: 'Easy on the eyes',
          icon: 'moon',
          color: '#5C6BC0',
        };
      case 'auto':
        return {
          title: 'Auto Theme',
          description: 'Follows system preference',
          icon: 'contrast',
          color: theme.primary,
        };
    }
  };

  const themeInfo = getThemeInfo();

  const handleSignOut = async () => {
    try {
      showInfo('Signing out...', 'Please wait while we sign you out.');
      await signOut();
      showSuccess('Signed out successfully', 'You have been signed out of your account.');
      // Navigate to auth screen after a short delay
      setTimeout(() => {
        router.replace('/auth/signin');
      }, 1000);
    } catch (error: any) {
      showError('Sign out failed', error.message || 'Failed to sign out. Please try again.');
    }
  };

  const profileOptions = [
    {
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      onPress: () => console.log('Edit Profile'),
    },
    {
      title: 'Verification Status',
      subtitle: 'Complete your identity verification',
      icon: 'shield-checkmark-outline',
      onPress: () => console.log('Verification'),
      badge: 'Pending',
    },
    {
      title: 'Eco Points',
      subtitle: '1,247 points earned',
      icon: 'leaf-outline',
      onPress: () => console.log('Eco Points'),
      badge: '1,247',
    },
    {
      title: 'Orders & Purchases',
      subtitle: 'View your marketplace orders',
      icon: 'bag-outline',
      onPress: () => console.log('Orders'),
    },
    {
      title: 'Privacy Settings',
      subtitle: 'Manage your privacy preferences',
      icon: 'lock-closed-outline',
      onPress: () => console.log('Privacy'),
    },
    {
      title: 'Notifications',
      subtitle: 'Customize your notification preferences',
      icon: 'notifications-outline',
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle-outline',
      onPress: () => console.log('Help'),
    },
    {
      title: 'About',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
      onPress: () => console.log('About'),
    },
  ];

  const renderProfileOption = (option: any, index: number) => (
    <Animated.View
      key={index}
      style={[
        styles.optionContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.optionButton,
          {
            backgroundColor: theme.surface[0],
            borderColor: theme.border,
          },
        ]}
        onPress={option.onPress}
      >
        <LinearGradient
          colors={theme.surface}
          style={styles.optionGradient}
        >
          <View style={styles.optionContent}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: theme.primary }]}>
                <Ionicons name={option.icon} size={20} color={theme.text} />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
                  {option.subtitle}
                </Text>
              </View>
            </View>
            <View style={styles.optionRight}>
              {option.badge && (
                <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.badgeText, { color: theme.text }]}>
                    {option.badge}
                  </Text>
                </View>
              )}
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.textTertiary}
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={theme.background}
        locations={theme.backgroundLocations}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })}],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={[styles.menuButton, { backgroundColor: `${theme.primary}20` }]}
            onPress={handleOpenSidebar}
          >
            <Ionicons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: `${theme.primary}20` }]}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <Animated.View
          style={[
            styles.profileCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={theme.surface}
            style={[styles.profileCardGradient, { borderColor: theme.border }]}
          >
            <View style={styles.profileInfo}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.userName, { color: theme.text }]}>
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </Text>
                  {session && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
                </View>
                <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                  {user?.email || 'No email'}
                </Text>
                <Text style={[styles.userStats, { color: theme.textTertiary }]}>
                  Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  }) : 'Unknown'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Theme Settings */}
        <Animated.View
          style={[
            styles.themeSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>
          <TouchableOpacity
            style={[
              styles.themeButton,
              {
                backgroundColor: theme.surface[0],
                borderColor: theme.border,
              },
            ]}
            onPress={toggleTheme}
          >
            <LinearGradient
              colors={theme.surface}
              style={styles.themeButtonGradient}
            >
              <View style={styles.themeContent}>
                <View style={styles.themeLeft}>
                  <View style={[styles.themeIcon, { backgroundColor: themeInfo.color }]}>
                    <Ionicons name={themeInfo.icon} size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.themeText}>
                    <Text style={[styles.themeTitle, { color: theme.text }]}>
                      {themeInfo.title}
                    </Text>
                    <Text style={[styles.themeDescription, { color: theme.textSecondary }]}>
                      {themeInfo.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.themeIndicator}>
                  <Text style={[styles.tapToChange, { color: theme.textTertiary }]}>
                    Tap to change
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.textTertiary}
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Options */}
        <Animated.View
          style={[
            styles.optionsSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Settings
          </Text>
          {profileOptions.map(renderProfileOption)}
        </Animated.View>

        {/* Sign Out Button */}
        <Animated.View
          style={[
            styles.signOutSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.signOutButton, { borderColor: theme.error }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.error} />
            <Text style={[styles.signOutText, { color: theme.error }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Sidebar */}
      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={handleCloseSidebar} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileCardGradient: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  themeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 12,
  },
  themeButton: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeButtonGradient: {
    padding: 16,
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeText: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  themeIndicator: {
    alignItems: 'flex-end',
  },
  tapToChange: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    marginBottom: 2,
  },
  optionsSection: {
    marginBottom: 24,
  },
  optionContainer: {
    marginBottom: 8,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionGradient: {
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  signOutSection: {
    marginTop: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
});