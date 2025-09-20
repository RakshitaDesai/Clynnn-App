import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = screenWidth * 0.8;

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 250);
  };

  const platformSections = [
    {
      title: 'Community Platform',
      icon: 'people',
      color: theme.primary,
      items: [
        { title: 'Home Feed', icon: 'home-outline', route: '/(tabs)/home' },
        { title: 'Communities', icon: 'people-outline', route: '/(tabs)/communities' },
        { title: 'Explore', icon: 'search-outline', route: '/(tabs)/explore' },
        { title: 'Messages', icon: 'mail-outline', route: '/(tabs)/messages' },
      ],
    },
    {
      title: 'Ecommerce Platform',
      icon: 'storefront',
      color: '#FF6B35',
      items: [
        { title: 'Marketplace', icon: 'storefront-outline', route: '/(tabs)/marketplace' },
        { title: 'My Orders', icon: 'receipt-outline', route: '/orders' },
        { title: 'Wishlist', icon: 'heart-outline', route: '/wishlist' },
        { title: 'Cart', icon: 'bag-outline', route: '/cart' },
      ],
    },
  ];

  const quickActions = [
    { title: 'Notifications', icon: 'notifications-outline', route: '/(tabs)/notifications', badge: '3' },
    { title: 'Settings', icon: 'settings-outline', route: '/settings' },
    { title: 'Help & Support', icon: 'help-circle-outline', route: '/support' },
  ];

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            width: SIDEBAR_WIDTH,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={isDark ? ['#1B5E20', '#2E7D32', '#1B5E20'] : ['#FFFFFF', '#F8F9FA', '#FFFFFF']}
          style={[styles.sidebarGradient, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
          {/* Status Bar Area */}
          <View style={[styles.statusBarArea, { height: insets.top, backgroundColor: isDark ? '#1B5E20' : '#FFFFFF' }]} />
          
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <TouchableOpacity
              style={[styles.profileSection, { borderColor: theme.border }]}
              onPress={() => handleNavigation('/profile')}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
                }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>

            {/* Record Waste Collection - Priority Action */}
            <View style={styles.section}>
              <TouchableOpacity
                style={[styles.priorityAction, { backgroundColor: `${theme.primary}15`, borderColor: `${theme.primary}30` }]}
                onPress={() => handleNavigation('/record-waste')}
              >
                <View style={[styles.priorityActionIcon, { backgroundColor: theme.primary }]}>
                  <Ionicons name="qr-code-outline" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.priorityActionContent}>
                  <Text style={[styles.priorityActionTitle, { color: theme.text }]}>
                    Record Waste Collection
                  </Text>
                  <Text style={[styles.priorityActionSubtitle, { color: theme.textSecondary }]}>
                    Scan QR codes to record waste
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>

            {/* Platform Sections */}
            {platformSections.map((section, sectionIndex) => (
              <View key={section.title} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: `${section.color}20` }]}>
                    <Ionicons name={section.icon as any} size={20} color={section.color} />
                  </View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    {section.title}
                  </Text>
                </View>

                <View style={styles.sectionItems}>
                  {section.items.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={item.title}
                      style={[styles.menuItem, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}
                      onPress={() => handleNavigation(item.route)}
                    >
                      <Ionicons name={item.icon as any} size={20} color={theme.textSecondary} />
                      <Text style={[styles.menuItemText, { color: theme.text }]}>
                        {item.title}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 16 }]}>
                Quick Actions
              </Text>
              <View style={styles.sectionItems}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.title}
                    style={[styles.menuItem, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}
                    onPress={() => handleNavigation(action.route)}
                  >
                    <Ionicons name={action.icon as any} size={20} color={theme.textSecondary} />
                    <Text style={[styles.menuItemText, { color: theme.text }]}>
                      {action.title}
                    </Text>
                    <View style={styles.actionRight}>
                      {action.badge && (
                        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                          <Text style={styles.badgeText}>{action.badge}</Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textTertiary }]}>
                Clynnn v1.0.0
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  sidebarGradient: {
    flex: 1,
  },
  statusBarArea: {
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  sectionItems: {
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    marginLeft: 12,
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  priorityAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  priorityActionContent: {
    flex: 1,
  },
  priorityActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 2,
  },
  priorityActionSubtitle: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
});