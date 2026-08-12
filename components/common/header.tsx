import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

const Header = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <View className="mb-10 flex flex-row items-center gap-2">
      <TouchableOpacity
        className="rounded-full bg-white"
        onPress={() => router.back()}
      >
        <ChevronLeft size={22} />
      </TouchableOpacity>
      <Text className={`text-2xl font-bold ${className}`}>{title}</Text>
    </View>
  );
};

export default Header;
