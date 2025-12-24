import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CreateAccountType,
  createAccountSchema,
  defaultCreateAccountValues,
} from "@/utils/schemas/auth-schema";

const useCreateAccount = () => {
  const { control, handleSubmit } = useForm<CreateAccountType>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: defaultCreateAccountValues,
  });

  const onSubmit = (data: CreateAccountType) => {
    console.log(data);
  };

  return { control, handleSubmit, onSubmit };
};

export default useCreateAccount;
