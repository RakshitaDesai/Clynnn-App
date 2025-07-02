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
  ScrollView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import ProductCard, { ProductData } from '../../components/ProductCard';
import Sidebar from '../../components/Sidebar';

// Mock data for products
const mockProducts: ProductData[] = [
  {
    id: '1',
    title: 'Bamboo Fiber Reusable Water Bottle',
    description: 'Eco-friendly water bottle made from sustainable bamboo fiber',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    seller: {
      name: 'EcoGoods Co.',
      rating: 4.8,
      verified: true,
    },
    category: 'Drinkware',
    sustainability: {
      score: 5,
      badges: ['Bamboo Fiber', 'BPA-Free', 'Recyclable'],
    },
    inStock: true,
    discount: 28,
    rating: 4.6,
    reviews: 127,
  },
  {
    id: '2',
    title: 'Organic Cotton Tote Bag Set',
    description: 'Set of 3 reusable shopping bags made from organic cotton',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    seller: {
      name: 'Green Living',
      rating: 4.5,
      verified: true,
    },
    category: 'Bags',
    sustainability: {
      score: 4,
      badges: ['Organic Cotton', 'Fair Trade'],
    },
    inStock: true,
    rating: 4.3,
    reviews: 89,
  },
  {
    id: '3',
    title: 'Solar-Powered LED Garden Lights',
    description: 'Beautiful solar garden lights for eco-friendly outdoor lighting',
    price: 45.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
    seller: {
      name: 'Solar Solutions',
      rating: 4.9,
      verified: true,
    },
    category: 'Lighting',
    sustainability: {
      score: 5,
      badges: ['Solar Powered', 'Zero Emissions'],
    },
    inStock: true,
    discount: 23,
    rating: 4.7,
    reviews: 203,
  },
  {
    id: '4',
    title: 'Compost Bin for Kitchen',
    description: 'Compact kitchen compost bin with charcoal filter',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    seller: {
      name: 'CompostMaster',
      rating: 4.6,
      verified: false,
    },
    category: 'Composting',
    sustainability: {
      score: 5,
      badges: ['Waste Reduction', 'Odor-Free'],
    },
    inStock: false,
    rating: 4.4,
    reviews: 56,
  },
  {
    id: '5',
    title: 'Recycled Plastic Outdoor Furniture',
    description: 'Durable outdoor chair made from 100% recycled plastic',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop',
    seller: {
      name: 'RecycleChair Co.',
      rating: 4.7,
      verified: true,
    },
    category: 'Furniture',
    sustainability: {
      score: 5,
      badges: ['100% Recycled', 'Weather Resistant'],
    },
    inStock: true,
    rating: 4.5,
    reviews: 34,
  },
  {
    id: '6',
    title: 'Natural Bamboo Toothbrush Set',
    description: 'Pack of 4 biodegradable bamboo toothbrushes',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop',
    seller: {
      name: 'Eco Oral Care',
      rating: 4.4,
      verified: true,
    },
    category: 'Personal Care',
    sustainability: {
      score: 5,
      badges: ['Biodegradable', 'Plastic-Free'],
    },
    inStock: true,
    rating: 4.2,
    reviews: 178,
  },
];

export default function Shop() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<ProductData[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
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
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleProductPress = (productId: string) => {
    console.log('Product pressed:', productId);
  };

  const handleAddToCart = (productId: string) => {
    console.log('Added to cart:', productId);
  };

  const handleFavorite = (productId: string) => {
    console.log('Favorited:', productId);
  };

  const handleOpenSidebar = () => {
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  const handleNotifications = () => {
    router.push('/(tabs)/notifications');
  };

  const renderProduct = ({ item, index }: { item: ProductData; index: number }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      onAddToCart={handleAddToCart}
      onFavorite={handleFavorite}
      style={{
        marginLeft: index % 2 === 0 ? 0 : 8,
        marginRight: index % 2 === 0 ? 8 : 0,
      }}
    />
  );

  const categories = [
    { name: 'All', icon: 'apps-outline' },
    { name: 'Bags', icon: 'bag-outline' },
    { name: 'Drinkware', icon: 'water-outline' },
    { name: 'Lighting', icon: 'bulb-outline' },
    { name: 'Furniture', icon: 'home-outline' },
  ];

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={[styles.menuButton, { backgroundColor: `${theme.primary}20` }]}
            onPress={handleOpenSidebar}
          >
            <Ionicons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>EcoMarket</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Sustainable Shopping
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.notificationButton, { backgroundColor: `${theme.primary}20` }]}
            onPress={handleNotifications}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.primary} />
            <View style={[styles.notificationBadge, { backgroundColor: theme.error }]}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface[0], borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={20} color={theme.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search eco-friendly products..."
          placeholderTextColor={theme.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              { backgroundColor: theme.surface[0], borderColor: theme.border }
            ]}
          >
            <Ionicons name={category.icon as any} size={18} color={theme.primary} />
            <Text style={[styles.categoryText, { color: theme.text }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Banner */}
      <View style={[styles.bannerContainer, { backgroundColor: theme.primary }]}>
        <LinearGradient
          colors={[theme.primary, theme.primaryLight]}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text style={[styles.bannerTitle, { color: theme.text }]}>
                🌱 Go Green Sale
              </Text>
              <Text style={[styles.bannerSubtitle, { color: theme.text }]}>
                Up to 50% off eco-friendly products
              </Text>
            </View>
            <TouchableOpacity style={[styles.bannerButton, { backgroundColor: theme.card[0] }]}>
              <Text style={[styles.bannerButtonText, { color: theme.primary }]}>
                Shop Now
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
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

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContent}
          columnWrapperStyle={styles.row}
        />
      </Animated.View>

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
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  bannerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerGradient: {
    padding: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  bannerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  productsContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
});