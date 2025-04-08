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
import { addPrize } from "../api";

const AddPrize = () => {
   const [form, setForm] = useState({
      prize_name: "",
      description: "",
      position: 1,
   });
   const { hackathonId } = useParams();
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

   const handlePositionChange = (value) =>
      setForm({ ...form, position: value });

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { data } = await addPrize(hackathonId, form);
         enqueueSnackbar(data.message, { variant: "success" });
         navigate("/organizer/dashboard");
      } catch (error) {
         enqueueSnackbar(
            error.response?.data.message || "Prize addition failed",
            { variant: "error" }
         );
      }
   };

   return (
      <Box p={8} maxW="md" mx="auto">
         <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
               <FormControl>
                  <FormLabel>Prize Name</FormLabel>
                  <Input
                     name="prize_name"
                     value={form.prize_name}
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
                  <FormLabel>Position</FormLabel>
                  <NumberInput
                     min={1}
                     value={form.position}
                     onChange={handlePositionChange}
                  >
                     <NumberInputField />
                  </NumberInput>
               </FormControl>
               <Button type="submit" colorScheme="teal" width="full">
                  Add Prize
               </Button>
            </VStack>
         </form>
      </Box>
   );
};

export default AddPrize;
