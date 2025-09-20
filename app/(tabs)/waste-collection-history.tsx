import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import FloatingActionButton from '../../components/FloatingActionButton';

interface WasteCollection {
  id: string;
  date: string;
  time: string;
  wasteType: 'organic' | 'recyclable' | 'general' | 'hazardous';
  weight: number;
  collector: string;
  status: 'collected' | 'verified' | 'processed';
  qrCode: string;
  notes?: string;
}

interface HouseholdInfo {
  address: string;
  householdId: string;
  totalCollections: number;
  totalWasteCollected: number;
  lastCollection: string;
}

const mockHouseholdInfo: HouseholdInfo = {
  address: '123 Green Valley Apartments, Unit 4B',
  householdId: 'HH_001',
  totalCollections: 8,
  totalWasteCollected: 125,
  lastCollection: '2025-08-02',
};

const mockWasteCollections: WasteCollection[] = [
  {
    id: '1',
    date: '2025-08-02',
    time: '09:15 AM',
    wasteType: 'organic',
    weight: 12.5,
    collector: 'Sarah Johnson',
    status: 'processed',
    qrCode: 'WC_ORG_20250802_001',
    notes: 'Kitchen waste, properly segregated',
  },
  {
    id: '2',
    date: '2025-08-01',
    time: '08:45 AM',
    wasteType: 'recyclable',
    weight: 8.2,
    collector: 'Mike Rodriguez',
    status: 'verified',
    qrCode: 'WC_REC_20250801_001',
    notes: 'Plastic bottles and cardboard boxes',
  },
  {
    id: '3',
    date: '2025-07-30',
    time: '10:20 AM',
    wasteType: 'general',
    weight: 15.8,
    collector: 'David Chen',
    status: 'processed',
    qrCode: 'WC_GEN_20250730_001',
  },
  {
    id: '4',
    date: '2025-07-28',
    time: '09:30 AM',
    wasteType: 'organic',
    weight: 10.3,
    collector: 'Sarah Johnson',
    status: 'processed',
    qrCode: 'WC_ORG_20250728_001',
    notes: 'Food scraps and garden waste',
  },
  {
    id: '5',
    date: '2025-07-26',
    time: '11:15 AM',
    wasteType: 'recyclable',
    weight: 6.7,
    collector: 'Mike Rodriguez',
    status: 'processed',
    qrCode: 'WC_REC_20250726_001',
  },
  {
    id: '6',
    date: '2025-07-24',
    time: '08:50 AM',
    wasteType: 'hazardous',
    weight: 2.1,
    collector: 'Alex Turner',
    status: 'verified',
    qrCode: 'WC_HAZ_20250724_001',
    notes: 'Batteries and electronic waste',
  },
  {
    id: '7',
    date: '2025-07-22',
    time: '09:40 AM',
    wasteType: 'general',
    weight: 18.5,
    collector: 'David Chen',
    status: 'processed',
    qrCode: 'WC_GEN_20250722_001',
  },
  {
    id: '8',
    date: '2025-07-20',
    time: '10:05 AM',
    wasteType: 'organic',
    weight: 14.2,
    collector: 'Sarah Johnson',
    status: 'processed',
    qrCode: 'WC_ORG_20250720_001',
    notes: 'Composted vegetable peels',
  },
];

export default function WasteCollectionHistory() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [householdInfo] = useState<HouseholdInfo>(mockHouseholdInfo);
  const [collections, setCollections] = useState<WasteCollection[]>(mockWasteCollections);
  const [refreshing, setRefreshing] = useState(false);

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

  const getWasteTypeColor = (wasteType: string) => {
    switch (wasteType) {
      case 'organic':
        return '#4CAF50';
      case 'recyclable':
        return '#2196F3';
      case 'general':
        return '#9E9E9E';
      case 'hazardous':
        return '#FF5722';
      default:
        return theme.textTertiary;
    }
  };

  const getWasteTypeIcon = (wasteType: string) => {
    switch (wasteType) {
      case 'organic':
        return 'leaf-outline';
      case 'recyclable':
        return 'refresh-circle-outline';
      case 'general':
        return 'trash-outline';
      case 'hazardous':
        return 'warning-outline';
      default:
        return 'cube-outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return theme.success;
      case 'verified':
        return '#FF9800';
      case 'collected':
        return theme.primary;
      default:
        return theme.textTertiary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return 'checkmark-circle';
      case 'verified':
        return 'shield-checkmark-outline';
      case 'collected':
        return 'cube-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const formatWeight = (weight: number) => {
    return `${weight} kg`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleFloatingAction = () => {
    router.push('/record-waste');
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: fadeAnim, borderBottomColor: theme.border }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Waste Collection History</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>{householdInfo.address}</Text>
          </View>
        </View>
        <View style={[styles.statsContainer]}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{householdInfo.totalCollections}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Collections</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderCollectionCard = ({ item }: { item: WasteCollection }) => (
    <Animated.View 
      style={[
        styles.collectionCard,
        { 
          opacity: fadeAnim,
          borderColor: theme.border,
        }
      ]}
    >
      <LinearGradient colors={theme.surface} style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={[styles.wasteTypeIcon, { backgroundColor: `${getWasteTypeColor(item.wasteType)}20` }]}>
              <Ionicons 
                name={getWasteTypeIcon(item.wasteType)} 
                size={24} 
                color={getWasteTypeColor(item.wasteType)} 
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.wasteType, { color: theme.text }]}>
                {item.wasteType.charAt(0).toUpperCase() + item.wasteType.slice(1)} Waste
              </Text>
              <Text style={[styles.collectionDate, { color: theme.textSecondary }]}>
                {formatDate(item.date)} • {item.time}
              </Text>
            </View>
          </View>
          {/* <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons name={getStatusIcon(item.status)} size={12} color="#FFFFFF" />
            <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
              {item.status.toUpperCase()}
            </Text>
          </View> */}
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="scale-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                {formatWeight(item.weight)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="person-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                {item.collector}
              </Text>
            </View>
          </View>
          
          {/* <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="qr-code-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.qrCodeText, { color: theme.textSecondary }]}>
                {item.qrCode}
              </Text>
            </View>
          </View> */}

          {/* {item.notes && (
            <View style={[styles.notesContainer, { backgroundColor: theme.border }]}>
              <Ionicons name="document-text-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.notesText, { color: theme.textSecondary }]}>
                {item.notes}
              </Text>
            </View>
          )} */}
        </View>
      </LinearGradient>
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

      <FlatList
        data={collections}
        renderItem={renderCollectionCard}
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
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Action Button for QR Scanner */}
      <FloatingActionButton onPress={handleFloatingAction} icon="qr-code-outline" />
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
    flex: 1,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    marginTop: 2,
  },
  statsContainer: {
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  collectionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wasteTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  wasteType: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  collectionDate: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },
  cardDetails: {
    marginTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  qrCodeText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Monaco' : 'monospace',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  notesText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    flex: 1,
    fontStyle: 'italic',
  },
});