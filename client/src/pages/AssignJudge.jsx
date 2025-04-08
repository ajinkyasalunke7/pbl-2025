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
import { assignJudge } from "../api";

const AssignJudge = () => {
   const [judgeId, setJudgeId] = useState("");
   const { hackathonId } = useParams();
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { data } = await assignJudge(hackathonId, { judge_id: judgeId });
         enqueueSnackbar(data.message, { variant: "success" });
         navigate("/organizer/dashboard");
      } catch (error) {
         enqueueSnackbar(error.response?.data.message || "Assignment failed", {
            variant: "error",
         });
      }
   };

   return (
      <Box p={8} maxW="md" mx="auto">
         <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
               <FormControl>
                  <FormLabel>Judge ID</FormLabel>
                  <Input
                     value={judgeId}
                     onChange={(e) => setJudgeId(e.target.value)}
                     required
                  />
               </FormControl>
               <Button type="submit" colorScheme="teal" width="full">
                  Assign Judge
               </Button>
            </VStack>
         </form>
      </Box>
   );
};

export default AssignJudge;
