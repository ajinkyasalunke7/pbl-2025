import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
   Box,
   Button,
   FormControl,
   FormLabel,
   Input,
   NumberInput,
   NumberInputField,
   VStack,
} from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { createHackathon } from "../api";

const CreateHackathon = () => {
   const [form, setForm] = useState({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      max_team_size: 4,
      registration_start_date: "",
      registration_end_date: "",
   });
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

   const handleMaxTeamSizeChange = (value) =>
      setForm({ ...form, max_team_size: value });

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { data } = await createHackathon(form);
         enqueueSnackbar(data.message, { variant: "success" });
         navigate("/organizer/dashboard");
      } catch (error) {
         enqueueSnackbar(error.response?.data.message || "Creation failed", {
            variant: "error",
         });
      }
   };

   return (
      <Box p={8} maxW="md" mx="auto">
         <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
               <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                     name="title"
                     value={form.title}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                     name="description"
                     value={form.description}
                     onChange={handleChange}
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                     type="datetime-local"
                     name="start_date"
                     value={form.start_date}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>End Date</FormLabel>
                  <Input
                     type="datetime-local"
                     name="end_date"
                     value={form.end_date}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Max Team Size</FormLabel>
                  <NumberInput
                     min={1}
                     value={form.max_team_size}
                     onChange={handleMaxTeamSizeChange}
                  >
                     <NumberInputField />
                  </NumberInput>
               </FormControl>
               <FormControl>
                  <FormLabel>Registration Start Date</FormLabel>
                  <Input
                     type="datetime-local"
                     name="registration_start_date"
                     value={form.registration_start_date}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Registration End Date</FormLabel>
                  <Input
                     type="datetime-local"
                     name="registration_end_date"
                     value={form.registration_end_date}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <Button type="submit" colorScheme="teal" width="full">
                  Create Hackathon
               </Button>
            </VStack>
         </form>
      </Box>
   );
};

export default CreateHackathon;
