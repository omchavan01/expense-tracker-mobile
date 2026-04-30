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
    <View className="flex flex-row items-center gap-2 mb-10">
      <TouchableOpacity
        className="bg-white rounded-full"
        onPress={() => router.back()}
      >
        <ChevronLeft size={22} />
      </TouchableOpacity>
      <Text className={`text-2xl font-bold ${className}`}>{title}</Text>
    </View>
  );
};

export default Header;
