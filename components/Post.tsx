import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export interface PostData {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  image?: string;
  liked?: boolean;
  reposted?: boolean;
}

interface PostProps {
  post: PostData;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const Post: React.FC<PostProps> = ({
  post,
  onLike,
  onComment,
  onRepost,
  onShare,
}) => {
  const { theme } = useTheme();
  const [isLiked, setIsLiked] = useState(post.liked || false);
  const [isReposted, setIsReposted] = useState(post.reposted || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [repostCount, setRepostCount] = useState(post.reposts);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLike?.(post.id);
  };

  const handleRepost = () => {
    const newRepostState = !isReposted;
    setIsReposted(newRepostState);
    setRepostCount(prev => newRepostState ? prev + 1 : prev - 1);
    onRepost?.(post.id);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <View style={[styles.container, { borderColor: theme.border }]}>
      <LinearGradient
        colors={theme.surface}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
          <View style={styles.authorInfo}>
            <View style={styles.authorNameRow}>
              <Text style={[styles.authorName, { color: theme.text }]}>{post.author.name}</Text>
              {post.author.verified && (
                <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
              )}
            </View>
            <Text style={[styles.username, { color: theme.textSecondary }]}>@{post.author.username}</Text>
          </View>
          <Text style={[styles.timestamp, { color: theme.textTertiary }]}>{post.timestamp}</Text>
        </View>

        {/* Content */}
        <Text style={[styles.content, { color: theme.text }]}>{post.content}</Text>

        {/* Image */}
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.postImage} />
        )}

        {/* Actions */}
        <View style={[styles.actions, { borderTopColor: theme.border }]}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onComment?.(post.id)}
          >
            <Ionicons 
              name="chatbubble-outline" 
              size={18} 
              color={theme.textSecondary} 
            />
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>{formatNumber(post.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRepost}
          >
            <Ionicons 
              name="repeat-outline" 
              size={18} 
              color={isReposted ? theme.primary : theme.textSecondary} 
            />
            <Text style={[
              styles.actionText, 
              { color: isReposted ? theme.primary : theme.textSecondary }
            ]}>
              {formatNumber(repostCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleLike}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={18} 
              color={isLiked ? theme.error : theme.textSecondary} 
            />
            <Text style={[
              styles.actionText, 
              { color: isLiked ? theme.error : theme.textSecondary }
            ]}>
              {formatNumber(likeCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onShare?.(post.id)}
          >
            <Ionicons 
              name="share-outline" 
              size={18} 
              color={theme.textSecondary} 
            />
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>{formatNumber(post.shares)}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  username: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  content: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontWeight: '500',
  },
});

export default Post;