// Legacy route — redirects to budget tab
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function CategoriesRedirect() {
  useEffect(() => {
    router.replace('/tabs/budget');
  }, []);
  return null;
}
