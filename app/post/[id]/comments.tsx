import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { addComment, getPostComments, PostComment } from '../../../services/postService';

interface Comment {
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
  liked?: boolean;
  replies?: Comment[];
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Green Supporter',
      username: 'greensupporter',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    content: 'This is amazing! Thank you for making a difference in our community. 🌱',
    timestamp: '1h',
    likes: 12,
    liked: false,
  },
  {
    id: '2',
    author: {
      name: 'EcoActivist',
      username: 'ecoactivist',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    content: 'Where was this cleanup organized? I\'d love to join the next one!',
    timestamp: '45m',
    likes: 8,
    liked: true,
  },
  {
    id: '3',
    author: {
      name: 'Community Helper',
      username: 'helpinghands',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Great initiative! Every small step counts towards a cleaner planet.',
    timestamp: '30m',
    likes: 15,
    liked: false,
  },
];

export default function CommentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Empty Comment', 'Please enter a comment.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const commentData: PostComment = {
        postId: id!,
        userId: 'currentUserId', // TODO: Get from auth context
        content: newComment.trim(),
      };

      const result = await addComment(commentData);
      
      if (result.success && result.comment) {
        const newCommentForState: Comment = {
          id: result.comment.id!,
          author: result.comment.author!,
          content: result.comment.content,
          timestamp: 'now',
          likes: 0,
          liked: false,
        };
        
        setComments(prev => [newCommentForState, ...prev]);
        setNewComment('');
        textInputRef.current?.blur();
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleLikeComment = async (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const newLikedState = !comment.liked;
        return {
          ...comment,
          liked: newLikedState,
          likes: newLikedState ? comment.likes + 1 : comment.likes - 1,
        };
      }
      return comment;
    }));

    // TODO: Implement actual Supabase like functionality
    console.log('Liked comment:', commentId);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={[styles.commentItem, { borderBottomColor: theme.border }]}>
      <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: theme.text }]}>{item.author.name}</Text>
            {item.author.verified && (
              <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
            )}
            <Text style={[styles.username, { color: theme.textSecondary }]}>@{item.author.username}</Text>
          </View>
          <Text style={[styles.timestamp, { color: theme.textTertiary }]}>{item.timestamp}</Text>
        </View>
        
        <Text style={[styles.commentText, { color: theme.text }]}>{item.content}</Text>
        
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLikeComment(item.id)}
          >
            <Ionicons 
              name={item.liked ? "heart" : "heart-outline"} 
              size={16} 
              color={item.liked ? theme.error : theme.textSecondary} 
            />
            <Text style={[
              styles.actionText, 
              { color: item.liked ? theme.error : theme.textSecondary }
            ]}>
              {formatNumber(item.likes)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={theme.background}
          locations={theme.backgroundLocations}
          style={StyleSheet.absoluteFill}
        />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: `${theme.textSecondary}20` }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Comments</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          style={styles.commentsList}
          contentContainerStyle={styles.commentsContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input */}
        <View style={[styles.commentInput, { borderTopColor: theme.border, backgroundColor: theme.surface[0] }]}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face' }} 
            style={styles.userAvatar} 
          />
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              style={[styles.textInput, { color: theme.text, borderColor: theme.border }]}
              placeholder="Add a comment..."
              placeholderTextColor={theme.textSecondary}
              multiline
              maxLength={280}
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { 
                  backgroundColor: newComment.trim() ? theme.primary : theme.textSecondary + '40',
                  opacity: isSubmitting ? 0.5 : 1 
                }
              ]}
              onPress={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    flex: 1,
  },
  headerSpacer: {
    width: 48,
  },
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    paddingVertical: 8,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  username: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  commentText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    lineHeight: 18,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});