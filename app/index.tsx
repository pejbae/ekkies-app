import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { isOnboardingComplete } from '@/constants/storage';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    isOnboardingComplete().then((v) => {
      setComplete(v);
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return <Redirect href={complete ? '/tabs' : '/onboarding'} />;
}
