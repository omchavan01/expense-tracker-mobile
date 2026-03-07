import { Redirect } from "expo-router";

import { useAuth } from "@/contexts/auth-provider";
import { Loader } from "@/components/common/loader";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Loader color="#321A5C" className="flex-1 items-center justify-center" />
    );
  }

  return <Redirect href={user?.isAuthenticated ? "/(tabs)/home" : "/(auth)"} />;
}
