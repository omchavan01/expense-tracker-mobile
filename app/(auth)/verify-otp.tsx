import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { OtpInput } from "react-native-otp-entry";

import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import NoInternet from "@/components/common/no-internet";
import useVerifyOTP from "@/hooks/auth/use-verify-otp";
import { useNetInfo } from "@/contexts/net-info-provider";

const OTP_COLORS = {
  border: "rgb(210, 210, 210)",
  primary: "rgb(116, 66, 207)",
  error: "rgb(220, 50, 50)",
  text: "rgb(15, 15, 15)",
};

const VerifyOTP = () => {
  const { isConnected } = useNetInfo();
  const {
    handleSubmit,
    onVerifyOTP,
    setValue,
    errors,
    clearErrors,
    isSubmitting,
    handleResendOTP,
  } = useVerifyOTP();
  const [timer, setTimer] = useState("3:00");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === "0:00") {
          return "0:00";
        }
        const [minutes, seconds] = prev.split(":").map(Number);
        if (seconds === 0) {
          if (minutes === 0) {
            return "0:00";
          }
          return `${minutes - 1}:59`;
        }
        return `${minutes}:${seconds - 1 < 10 ? "0" + (seconds - 1) : seconds - 1}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white px-4">
        <KeyboardAwareScrollView
          className="mt-10"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold mb-12">Verify OTP</Text>
          <OtpInput
            numberOfDigits={4}
            onTextChange={(value) => {
              setValue("otp", value);
              if (errors.otp) {
                clearErrors("otp");
              }
            }}
            theme={{
              pinCodeContainerStyle: {
                width: 60,
                height: 60,
                borderRadius: 12,
                borderWidth: 1.5,
                backgroundColor: "#FFFFFF",
                borderColor: errors.otp ? OTP_COLORS.error : OTP_COLORS.border,
              },
              focusedPinCodeContainerStyle: {
                borderWidth: 2,
                borderColor: errors.otp ? OTP_COLORS.error : OTP_COLORS.primary,
              },
              pinCodeTextStyle: {
                fontSize: 24,
                color: OTP_COLORS.text,
              },
              focusStickStyle: {
                backgroundColor: errors.otp
                  ? OTP_COLORS.error
                  : OTP_COLORS.primary,
              },
            }}
          />
          {errors.otp && (
            <Text className="text-error-500 mt-4">{errors.otp.message}</Text>
          )}
        </KeyboardAwareScrollView>
        <View className="py-10 w-full flex justify-center items-center">
          <Button
            onPress={handleSubmit(onVerifyOTP)}
            variant="solid"
            size="xl"
            className="rounded-full bg-primary-600 w-[75%]"
            disabled={isSubmitting || !isConnected}
          >
            {isSubmitting && <ButtonSpinner className="text-white" />}
            <ButtonText size="md">
              {isSubmitting ? "Verifying OTP..." : "Verify OTP"}
            </ButtonText>
          </Button>

          <Button
            onPress={() => {
              handleResendOTP();
              setTimer("3:00");
            }}
            variant="link"
            disabled={timer !== "0:00" || !isConnected}
          >
            {timer === "0:00" ? (
              <ButtonText size="xs" className="text-typography-400">
                Did not receive the OTP? Resend
              </ButtonText>
            ) : (
              <ButtonText size="xs" className="text-typography-400">
                Did not receive the OTP? Resend in {timer}
              </ButtonText>
            )}
          </Button>
        </View>
      </View>
      {!isConnected && <NoInternet text="verifying your OTP" />}
    </SafeAreaView>
  );
};

export default VerifyOTP;
