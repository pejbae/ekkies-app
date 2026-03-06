import { Redirect } from 'expo-router';

// Entry point — sends user to onboarding for now.
// Later: check if user has completed onboarding → redirect to /tabs
export default function Index() {
  return <Redirect href="/onboarding" />;
}
