import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { enrollInHackathon } from "../api";

const Enroll = () => {
   const [form, setForm] = useState({
      team_name: "",
      description: "",
      team_size: 1,
   });
   const { hackathonId } = useParams();
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

   const handleTeamSizeChange = (value) =>
      setForm({ ...form, team_size: value });

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { data } = await enrollInHackathon({
            hackathon_id: hackathonId,
            ...form,
         });
         enqueueSnackbar(data.message, { variant: "success" });
         navigate(data.data.redirect);
      } catch (error) {
         enqueueSnackbar(error.response?.data.message || "Enrollment failed", {
            variant: "error",
         });
      }
   };

   return (
      <Box p={8} maxW="md" mx="auto">
         <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
               <FormControl>
                  <FormLabel>Team Name</FormLabel>
                  <Input
                     name="team_name"
                     value={form.team_name}
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
                     required
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Team Size (including you)</FormLabel>
                  <NumberInput
                     min={1}
                     value={form.team_size}
                     onChange={handleTeamSizeChange}
                  >
                     <NumberInputField />
                  </NumberInput>
               </FormControl>
               <Button type="submit" colorScheme="teal" width="full">
                  Enroll
               </Button>
            </VStack>
         </form>
      </Box>
   );
};

export default Enroll;
