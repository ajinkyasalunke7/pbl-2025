import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Box, Button, VStack, Spinner } from "@chakra-ui/react";
import { Field } from "@chakra-ui/form-control";
import { useSnackbar } from "notistack";
import { login, setAuthToken } from "../api";

const Login = () => {
   const [loading, setLoading] = useState(false);
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   const onSubmit = async (data) => {
      setLoading(true);
      try {
         const { data: response } = await login(data);
         setAuthToken(response.data.token);
         localStorage.setItem("token", response.data.token);
         localStorage.setItem("userType", response.data.user_type);
         enqueueSnackbar(response.message, { variant: "success" });
         navigate(
            response.data.user_type === "organizer"
               ? "/organizer/dashboard"
               : "/hackathons"
         );
      } catch (error) {
         enqueueSnackbar(error.response?.data.message || "Login failed", {
            variant: "error",
         });
      } finally {
         setLoading(false);
      }
   };

   return (
      <Box p={8} maxW="md" mx="auto">
         <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
               <Field
                  label="Email"
                  error={errors.email}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
               >
                  <input
                     {...register("email", {
                        required: "Email is required",
                        pattern: {
                           value: /^\S+@\S+$/i,
                           message: "Invalid email",
                        },
                     })}
                     className="chakra-input css-1c6j008" // Tailwind/Chakra styling
                  />
               </Field>
               <Field
                  label="Password"
                  error={errors.password}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
               >
                  <input
                     type="password"
                     {...register("password", {
                        required: "Password is required",
                        minLength: {
                           value: 6,
                           message: "Minimum 6 characters",
                        },
                     })}
                     className="chakra-input css-1c6j008"
                  />
               </Field>
               <Button
                  type="submit"
                  colorScheme="teal"
                  width="full"
                  isDisabled={loading}
               >
                  {loading ? <Spinner size="sm" /> : "Login"}
               </Button>
            </VStack>
         </form>
      </Box>
   );
};

export default Login;
