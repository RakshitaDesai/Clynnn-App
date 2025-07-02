import { useEffect } from 'react';
import { router } from 'expo-router';

export default function MarketplaceRedirect() {
  useEffect(() => {
    // Redirect to the marketplace tabs
    router.replace('/(marketplace)/shop');
  }, []);

  return null; // This component doesn't render anything
}