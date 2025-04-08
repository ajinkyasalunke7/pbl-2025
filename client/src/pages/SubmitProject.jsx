import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
   Box,
   Button,
   FormControl,
   FormLabel,
   Input,
   VStack,
} from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { submitProject } from "../api";

const SubmitProject = () => {
   const [form, setForm] = useState({
      team_id: "",
      project_name: "",
      description: "",
      github_url: "",
      demo_url: "",
   });
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const { data } = await submitProject(form);
         enqueueSnackbar(data.message, { variant: "success" });
         navigate("/hackathons");
      } catch (error) {
         enqueueSnackbar(error.response?.data.message || "Submission failed", {
            variant: "error",
         });
      }
   };

   return (
      <Box p={8} maxW="md" mx="auto">
         <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
               <FormControl>
                  <FormLabel>Team ID</FormLabel>
                  <Input
                     name="team_id"
                     value={form.team_id}
                     onChange={handleChange}
                     required
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Project Name</FormLabel>
                  <Input
                     name="project_name"
                     value={form.project_name}
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
                  <FormLabel>GitHub URL</FormLabel>
                  <Input
                     name="github_url"
                     value={form.github_url}
                     onChange={handleChange}
                  />
               </FormControl>
               <FormControl>
                  <FormLabel>Demo URL</FormLabel>
                  <Input
                     name="demo_url"
                     value={form.demo_url}
                     onChange={handleChange}
                  />
               </FormControl>
               <Button type="submit" colorScheme="teal" width="full">
                  Submit Project
               </Button>
            </VStack>
         </form>
      </Box>
   );
};

export default SubmitProject;
