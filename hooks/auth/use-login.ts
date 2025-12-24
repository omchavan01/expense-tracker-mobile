import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  loginSchema,
  LoginType,
  defaultLoginValues,
} from "@/utils/schemas/auth-schema";

const useLogin = () => {
  const { control, handleSubmit } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
  });

  const onSubmit = (data: LoginType) => {
    console.log(data);
  };

  return { control, handleSubmit, onSubmit };
};

export default useLogin;
