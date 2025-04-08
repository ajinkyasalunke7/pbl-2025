import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Field, Input, Select, VStack } from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { register, setAuthToken } from "../api";

const Register = () => {
   const [form, setForm] = useState({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      college_name: "",
      gender: "",
      user_type: "participant",
   });
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { data } = await register(form);
         setAuthToken(data.data.token);
         localStorage.setItem("token", data.data.token);
         localStorage.setItem("userType", data.data.user_type);
         enqueueSnackbar(data.message, { variant: "success" });
         navigate(
            data.data.user_type === "organizer"
               ? "/organizer/dashboard"
               : "/hackathons"
         );
      } catch (error) {
         enqueueSnackbar(
            error.response?.data.message || "Registration failed",
            { variant: "error" }
         );
      }
   };

   return (
      <Box p={8} maxW="md" mx="auto">
         <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
               <FormControl>
                  <Field.Label>Email</Field.Label>
                  <Input
                     name="email"
                     value={form.email}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <Field.Label>Password</Field.Label>
                  <Input
                     type="password"
                     name="password"
                     value={form.password}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <Field.Label>First Name</Field.Label>
                  <Input
                     name="first_name"
                     value={form.first_name}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <Field.Label>Last Name</Field.Label>
                  <Input
                     name="last_name"
                     value={form.last_name}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <Field.Label>College Name</Field.Label>
                  <Input
                     name="college_name"
                     value={form.college_name}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <Field.Label>Gender</Field.Label>
                  <Select
                     name="gender"
                     value={form.gender}
                     onChange={handleChange}
                     required
                  >
                     <option value="">Select Gender</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                  </Select>
               </FormControl>
               <FormControl>
                  <Field.Label>User Type</Field.Label>
                  <Select
                     name="user_type"
                     value={form.user_type}
                     onChange={handleChange}
                  >
                     <option value="participant">Participant</option>
                     <option value="organizer">Organizer</option>
                     <option value="judge">Judge</option>
                  </Select>
               </FormControl>
               <Button type="submit" colorScheme="teal" width="full">
                  Register
               </Button>
            </VStack>
         </form>
      </Box>
   );
};

export default Register;
