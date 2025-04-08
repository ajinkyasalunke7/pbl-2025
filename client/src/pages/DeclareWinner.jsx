import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
   Box,
   Button,
   FormControl,
   FormLabel,
   Input,
   VStack,
} from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { declareWinner } from "../api";

const DeclareWinner = () => {
   const [form, setForm] = useState({ prize_id: "", team_id: "" });
   const { hackathonId } = useParams();
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { data } = await declareWinner(hackathonId, form);
         enqueueSnackbar(data.message, { variant: "success" });
         navigate("/organizer/dashboard");
      } catch (error) {
         enqueueSnackbar(error.response?.data.message || "Declaration failed", {
            variant: "error",
         });
      }
   };

   return (
      <Box p={8} maxW="md" mx="auto">
         <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
               <FormControl>
                  <FormLabel>Prize ID</FormLabel>
                  <Input
                     name="prize_id"
                     value={form.prize_id}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Team ID</FormLabel>
                  <Input
                     name="team_id"
                     value={form.team_id}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <Button type="submit" colorScheme="teal" width="full">
                  Declare Winner
               </Button>
            </VStack>
         </form>
      </Box>
   );
};

export default DeclareWinner;
