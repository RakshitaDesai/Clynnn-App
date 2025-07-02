import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export default function Communities() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
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

  const communities = [
    {
      id: 1,
      name: 'EcoWarriors',
      members: '12.5K',
      category: 'Environmental',
      description: 'Join the fight against climate change',
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=100&h=100&fit=crop',
      color: '#4CAF50',
      isJoined: true,
    },
    {
      id: 2,
      name: 'Green Living',
      members: '8.2K',
      category: 'Lifestyle',
      description: 'Sustainable living tips and tricks',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop',
      color: '#66BB6A',
      isJoined: false,
    },
    {
      id: 3,
      name: 'Renewable Energy',
      members: '15.1K',
      category: 'Technology',
      description: 'Solar, wind, and clean energy discussions',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100&h=100&fit=crop',
      color: '#FFA726',
      isJoined: true,
    },
    {
      id: 4,
      name: 'Zero Waste',
      members: '6.8K',
      category: 'Lifestyle',
      description: 'Minimize waste, maximize impact',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=100&h=100&fit=crop',
      color: '#42A5F5',
      isJoined: false,
    },
  ];

  const renderCommunityCard = (community: any, index: number) => (
    <Animated.View
      key={community.id}
      style={[
        styles.communityCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.cardButton,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.surface[0],
            borderColor: theme.border,
          },
        ]}
      >
        <LinearGradient
          colors={isDark ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)'] : theme.surface}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <Image
              source={{ uri: community.image }}
              style={[styles.communityImage, { borderColor: community.color }]}
            />
            <View style={styles.communityInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.communityName, { color: theme.text }]}>
                  {community.name}
                </Text>
                {community.isJoined && (
                  <View style={[styles.joinedBadge, { backgroundColor: community.color }]}>
                    <Text style={styles.joinedText}>Joined</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.communityCategory, { color: community.color }]}>
                {community.category}
              </Text>
              <Text style={[styles.communityMembers, { color: theme.textSecondary }]}>
                {community.members} members
              </Text>
            </View>
          </View>
          
          <Text style={[styles.communityDescription, { color: theme.textSecondary }]}>
            {community.description}
          </Text>
          
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                community.isJoined 
                  ? { backgroundColor: 'transparent', borderColor: community.color, borderWidth: 1 }
                  : { backgroundColor: community.color }
              ]}
            >
              <Text style={[
                styles.actionButtonText,
                { color: community.isJoined ? community.color : '#FFFFFF' }
              ]}>
                {community.isJoined ? 'View' : 'Join'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${community.color}20` }]}>
              <Ionicons name="chatbubble-outline" size={16} color={community.color} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${community.color}20` }]}>
              <Ionicons name="share-outline" size={16} color={community.color} />
            </TouchableOpacity>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
            <Text style={[styles.headerTitle, { color: theme.text }]}>Communities</Text>
            <TouchableOpacity style={[styles.notificationButton, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name="notifications-outline" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Connect with like-minded eco enthusiasts
          </Text>
        </Animated.View>

        {/* Featured Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Trending Communities
          </Text>
          {communities.map(renderCommunityCard)}
        </Animated.View>

        {/* Categories */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Browse by Category
          </Text>
          
          <View style={styles.categoriesGrid}>
            {['Environmental', 'Lifestyle', 'Technology', 'Education'].map((category, index) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.surface[0],
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons 
                  name={
                    index === 0 ? 'leaf-outline' :
                    index === 1 ? 'home-outline' :
                    index === 2 ? 'bulb-outline' : 'school-outline'
                  } 
                  size={32} 
                  color={theme.primary} 
                />
                <Text style={[styles.categoryName, { color: theme.text }]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 16,
  },
  communityCard: {
    marginBottom: 16,
  },
  cardButton: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
  },
  communityInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginRight: 8,
  },
  joinedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  joinedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  communityCategory: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  communityMembers: {
    fontSize: 12,
  },
  communityDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});