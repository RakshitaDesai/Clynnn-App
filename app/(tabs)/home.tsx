import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import Post, { PostData } from '../../components/Post';
import Sidebar from '../../components/Sidebar';
import FloatingActionButton from '../../components/FloatingActionButton';
import { likePost, unlikePost, repostPost, unrepostPost } from '../../services/postService';

// Mock data for posts
const mockPosts: PostData[] = [
  {
    id: '1',
    author: {
      name: 'EcoWarrior Sarah',
      username: 'sarahgreen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    content: 'Just completed our neighborhood cleanup! Collected 50kg of recyclables and 20kg of waste. Every small action counts towards a cleaner planet! 🌱 #WasteManagement #EcoFriendly',
    timestamp: '2h',
    likes: 1247,
    comments: 89,
    reposts: 234,
    shares: 45,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    author: {
      name: 'GreenTech Solutions',
      username: 'greentechsol',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    content: 'AI-powered waste sorting is revolutionizing recycling! Our new system can identify and sort 95% of waste materials automatically. The future of waste management is here! 🤖♻️',
    timestamp: '4h',
    likes: 2891,
    comments: 156,
    reposts: 567,
    shares: 123,
  },
  {
    id: '3',
    author: {
      name: 'Community Helper',
      username: 'helpinghands',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Reminder: Plastic waste pickup is tomorrow at 8 AM. Please separate your plastic bottles, containers, and bags. Let\'s make our community cleaner together! 🗂️',
    timestamp: '6h',
    likes: 456,
    comments: 23,
    reposts: 89,
    shares: 12,
  },
  {
    id: '4',
    author: {
      name: 'Recycle Rob',
      username: 'recyclerob',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Did you know? Composting food waste can reduce your household waste by up to 30%! Started my composting journey last month and it\'s amazing how much organic waste we generate. 🌿',
    timestamp: '8h',
    likes: 789,
    comments: 67,
    reposts: 134,
    shares: 28,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    author: {
      name: 'City Waste Dept',
      username: 'citywastedept',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    content: 'New recycling guidelines are now in effect! Check our website for the updated list of recyclable materials. Together, we can achieve our goal of 80% waste diversion! 📋',
    timestamp: '12h',
    likes: 1567,
    comments: 234,
    reposts: 445,
    shares: 78,
  },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const [posts, setPosts] = React.useState<PostData[]>(mockPosts);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      setRefreshing(false);
      // You would fetch new posts here
    }, 1500);
  }, []);

  const handleLike = async (postId: string) => {
    // Find the post and update it optimistically
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const currentPost = posts[postIndex];
    const isCurrentlyLiked = currentPost.liked;
    
    // Optimistic update
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = {
      ...currentPost,
      liked: !isCurrentlyLiked,
      likes: isCurrentlyLiked ? currentPost.likes - 1 : currentPost.likes + 1
    };
    setPosts(updatedPosts);

    try {
      // Call the service
      if (isCurrentlyLiked) {
        await unlikePost(postId, 'currentUserId');
      } else {
        await likePost(postId, 'currentUserId');
      }
    } catch (error) {
      // Revert on error
      const revertedPosts = [...posts];
      revertedPosts[postIndex] = currentPost;
      setPosts(revertedPosts);
      console.error('Failed to like/unlike post:', error);
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/post/${postId}/comments`);
  };

  const handleRepost = async (postId: string) => {
    // Find the post and update it optimistically
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const currentPost = posts[postIndex];
    const isCurrentlyReposted = currentPost.reposted;
    
    // Optimistic update
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = {
      ...currentPost,
      reposted: !isCurrentlyReposted,
      reposts: isCurrentlyReposted ? currentPost.reposts - 1 : currentPost.reposts + 1
    };
    setPosts(updatedPosts);

    try {
      // Call the service
      if (isCurrentlyReposted) {
        await unrepostPost(postId, 'currentUserId');
      } else {
        await repostPost(postId, 'currentUserId');
      }
    } catch (error) {
      // Revert on error
      const revertedPosts = [...posts];
      revertedPosts[postIndex] = currentPost;
      setPosts(revertedPosts);
      console.error('Failed to repost/unrepost post:', error);
    }
  };

  const handleShare = (postId: string) => {
    console.log('Shared post:', postId);
    // Handle share logic here
  };

  const handleOpenSidebar = () => {
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  const handleFloatingAction = () => {
    router.push('/create-post');
  };

  const handleNotifications = () => {
    router.push('/(tabs)/notifications');
  };

  const renderPost = ({ item }: { item: PostData }) => (
    <Post
      post={item}
      onLike={handleLike}
      onComment={handleComment}
      onRepost={handleRepost}
      onShare={handleShare}
    />
  );

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: fadeAnim, borderBottomColor: theme.border }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={[styles.menuButton, { backgroundColor: `${theme.primary}20` }]}
            onPress={handleOpenSidebar}
          >
            <Ionicons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Home</Text>
        </View>
        <TouchableOpacity 
          style={[styles.notificationButton, { backgroundColor: `${theme.primary}20` }]}
          onPress={handleNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.primary} />
          {/* <View style={[styles.notificationBadge, { backgroundColor: theme.error }]}>
            <Text style={styles.badgeText}>3</Text>
          </View> */}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={theme.background}
        locations={theme.backgroundLocations}
        style={StyleSheet.absoluteFill}
      />

      {renderHeader()}

      <Animated.View style={[styles.feedContainer, { opacity: fadeAnim }]}>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedContent}
        />
      </Animated.View>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleFloatingAction} />

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
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginLeft: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  composeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    paddingVertical: 8,
  },
});