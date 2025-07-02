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

export interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  seller: {
    name: string;
    rating: number;
    verified?: boolean;
  };
  category: string;
  sustainability: {
    score: number; // 1-5 stars
    badges: string[]; // e.g., ['Recycled', 'Carbon Neutral', 'Biodegradable']
  };
  inStock: boolean;
  discount?: number;
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: ProductData;
  onPress?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onFavorite?: (productId: string) => void;
  style?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  onFavorite,
  style,
}) => {
  const { theme } = useTheme();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.(product.id);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderStars = (rating: number, size: number = 12, color?: string) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons
          key={i}
          name="star"
          size={size}
          color={color || theme.warning}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons
          key="half"
          name="star-half"
          size={size}
          color={color || theme.warning}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={size}
          color={color || theme.textTertiary}
        />
      );
    }

    return stars;
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress?.(product.id)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={theme.card}
        style={[styles.gradient, { borderColor: theme.border }]}
      >
        {/* Image and Favorite */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          
          {/* Discount Badge */}
          {product.discount && (
            <View style={[styles.discountBadge, { backgroundColor: theme.error }]}>
              <Text style={[styles.discountText, { color: theme.text }]}>
                -{product.discount}%
              </Text>
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: theme.card[0] }]}
            onPress={handleFavorite}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={18}
              color={isFavorited ? theme.error : theme.textSecondary}
            />
          </TouchableOpacity>

          {/* Stock Status */}
          {!product.inStock && (
            <View style={[styles.stockBadge, { backgroundColor: theme.error }]}>
              <Text style={[styles.stockText, { color: theme.text }]}>
                Out of Stock
              </Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.info}>
          <Text style={[styles.category, { color: theme.textTertiary }]}>
            {product.category}
          </Text>
          
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {product.title}
          </Text>

          {/* Sustainability Badges */}
          <View style={styles.sustainabilityContainer}>
            <View style={styles.sustainabilityScore}>
              {renderStars(product.sustainability.score, 10, theme.primary)}
            </View>
            <View style={styles.badges}>
              {product.sustainability.badges.slice(0, 2).map((badge, index) => (
                <View
                  key={index}
                  style={[styles.badge, { backgroundColor: theme.primary }]}
                >
                  <Text style={[styles.badgeText, { color: theme.text }]}>
                    {badge}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Rating and Reviews */}
          <View style={styles.ratingContainer}>
            <View style={styles.rating}>
              {renderStars(product.rating, 12)}
              <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
                {product.rating} ({product.reviews})
              </Text>
            </View>
          </View>

          {/* Seller Info */}
          <View style={styles.sellerContainer}>
            <Text style={[styles.sellerText, { color: theme.textTertiary }]}>
              by {product.seller.name}
            </Text>
            {product.seller.verified && (
              <Ionicons name="checkmark-circle" size={12} color={theme.primary} />
            )}
          </View>

          {/* Price and Actions */}
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: theme.text }]}>
                {formatPrice(product.price)}
              </Text>
              {product.originalPrice && (
                <Text style={[styles.originalPrice, { color: theme.textTertiary }]}>
                  {formatPrice(product.originalPrice)}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.addToCartButton,
                { backgroundColor: product.inStock ? theme.primary : theme.textTertiary }
              ]}
              onPress={() => onAddToCart?.(product.id)}
              disabled={!product.inStock}
            >
              <Ionicons
                name="bag-add-outline"
                size={16}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginVertical: 8,
  },
  gradient: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  stockText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  info: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    lineHeight: 18,
    marginBottom: 8,
  },
  sustainabilityContainer: {
    marginBottom: 8,
  },
  sustainabilityScore: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  ratingContainer: {
    marginBottom: 6,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  sellerText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  addToCartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;