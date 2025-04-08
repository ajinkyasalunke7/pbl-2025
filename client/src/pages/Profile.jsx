import { useState } from "react";
import {
   Box,
   Button,
   FormControl,
   FormLabel,
   Input,
   Select,
   VStack,
} from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { updateProfile } from "../api";

const Profile = () => {
   const [form, setForm] = useState({
      first_name: "",
      last_name: "",
      college_name: "",
      gender: "",
   });
   const { enqueueSnackbar } = useSnackbar();

   const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { data } = await updateProfile(form);
         enqueueSnackbar(data.message, { variant: "success" });
      } catch (error) {
         enqueueSnackbar(error.response?.data.message || "Update failed", {
            variant: "error",
         });
      }
   };

   return (
      <Box p={8} maxW="md" mx="auto">
         <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
               <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                     name="first_name"
                     value={form.first_name}
                     onChange={handleChange}
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                     name="last_name"
                     value={form.last_name}
                     onChange={handleChange}
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>College Name</FormLabel>
                  <Input
                     name="college_name"
                     value={form.college_name}
                     onChange={handleChange}
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Select
                     name="gender"
                     value={form.gender}
                     onChange={handleChange}
                  >
                     <option value="">Select Gender</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                  </Select>
               </FormControl>
               <Button type="submit" colorScheme="teal" width="full">
                  Update Profile
               </Button>
            </VStack>
         </form>
      </Box>
   );
};

export default Profile;
