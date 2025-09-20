import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { createPost } from '../services/postService';

interface AttachedImage {
  id: string;
  uri: string;
  width?: number;
  height?: number;
}

export default function CreatePost() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<AttachedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      allowsEditing: false,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset, index) => ({
        id: `${Date.now()}-${index}`,
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const insertText = (before: string, after: string = '') => {
    const input = textInputRef.current;
    if (!input) return;

    const selection = input.getSelection?.() || { start: content.length, end: content.length };
    const newText = content.slice(0, selection.start) + before + content.slice(selection.start, selection.end) + after + content.slice(selection.end);
    
    setContent(newText);
    setShowFormatMenu(false);
    
    // Focus back to input
    setTimeout(() => {
      input.focus();
    }, 100);
  };

  const handleBold = () => insertText('**', '**');
  const handleItalics = () => insertText('_', '_');
  const handleLink = () => {
    Alert.prompt(
      'Add Link',
      'Enter the URL:',
      (url) => {
        if (url) {
          Alert.prompt(
            'Link Text',
            'Enter the display text (optional):',
            (text) => {
              const linkText = text || url;
              insertText(`[${linkText}](${url})`);
            }
          );
        }
      },
      'plain-text',
      '',
      'url'
    );
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      Alert.alert('Empty Post', 'Please add some content or images to your post.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createPost({
        content: content.trim(),
        images: images.map(img => img.uri),
        userId: 'currentUserId', // TODO: Get from auth context
      });
      
      if (result.success) {
        Alert.alert('Success', 'Your post has been created!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const formatMenuItems = [
    { id: 'bold', icon: 'text-outline', label: 'Bold', onPress: handleBold },
    { id: 'italic', icon: 'text-outline', label: 'Italic', onPress: handleItalics },
    { id: 'link', icon: 'link-outline', label: 'Link', onPress: handleLink },
  ];

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
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: `${theme.textSecondary}20` }]}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Create Post</Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.postButton,
              { 
                backgroundColor: content.trim() || images.length > 0 ? theme.primary : theme.textSecondary + '40',
                opacity: isSubmitting ? 0.5 : 1 
              }
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || (!content.trim() && images.length === 0)}
          >
            <Text style={[styles.postButtonText, { color: '#FFFFFF' }]}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <TextInput
            ref={textInputRef}
            style={[styles.textInput, { color: theme.text }]}
            placeholder="What's happening in your community?"
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
            maxLength={280}
          />

          {/* Character count */}
          <Text style={[styles.charCount, { color: content.length > 250 ? theme.error : theme.textSecondary }]}>
            {content.length}/280
          </Text>

          {/* Images */}
          {images.length > 0 && (
            <View style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={image.id} style={styles.imageWrapper}>
                  <Image source={{ uri: image.uri }} style={styles.attachedImage} />
                  <TouchableOpacity
                    style={[styles.removeImageButton, { backgroundColor: theme.error }]}
                    onPress={() => removeImage(image.id)}
                  >
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Toolbar */}
        <View style={[styles.toolbar, { borderTopColor: theme.border, backgroundColor: theme.surface[0] }]}>
          <View style={styles.toolbarLeft}>
            <TouchableOpacity
              style={[styles.toolButton, { backgroundColor: `${theme.primary}20` }]}
              onPress={handleImagePicker}
            >
              <Ionicons name="image-outline" size={20} color={theme.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolButton, { backgroundColor: `${theme.primary}20` }]}
              onPress={() => setShowFormatMenu(!showFormatMenu)}
            >
              <Ionicons name="text-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {images.length > 0 && (
            <Text style={[styles.imageCount, { color: theme.textSecondary }]}>
              {images.length} image{images.length !== 1 ? 's' : ''} attached
            </Text>
          )}
        </View>

        {/* Format Menu Modal */}
        <Modal
          visible={showFormatMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFormatMenu(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowFormatMenu(false)}
          >
            <View style={[styles.formatMenu, { backgroundColor: theme.surface[0], borderColor: theme.border }]}>
              <Text style={[styles.formatMenuTitle, { color: theme.text }]}>Format Text</Text>
              {formatMenuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.formatMenuItem, { borderBottomColor: theme.border }]}
                  onPress={item.onPress}
                >
                  <Ionicons name={item.icon as any} size={20} color={theme.primary} />
                  <Text style={[styles.formatMenuText, { color: theme.text }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
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
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  textInput: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    lineHeight: 22,
    minHeight: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginVertical: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  attachedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  toolbarLeft: {
    flexDirection: 'row',
    gap: 12,
  },
  toolButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCount: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formatMenu: {
    minWidth: 200,
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
  },
  formatMenuTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
    textAlign: 'center',
  },
  formatMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  formatMenuText: {
    fontSize: 14,
  },
});