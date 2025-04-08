import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
   Box,
   Heading,
   Table,
   Tbody,
   Td,
   Th,
   Thead,
   Tr,
} from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { getHackathonProjects } from "../api";

const HackathonProjects = () => {
   const [projects, setProjects] = useState([]);
   const { hackathonId } = useParams();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const fetchProjects = async () => {
         try {
            const { data } = await getHackathonProjects(hackathonId);
            setProjects(data.data);
         } catch (error) {
            enqueueSnackbar(
               error.response?.data.message || "Failed to fetch projects",
               { variant: "error" }
            );
         }
      };
      fetchProjects();
   }, [hackathonId, enqueueSnackbar]);

   return (
      <Box p={8}>
         <Heading mb={4}>Hackathon Projects</Heading>
         <Table variant="simple">
            <Thead>
               <Tr>
                  <Th>Project Name</Th>
                  <Th>Team ID</Th>
                  <Th>Description</Th>
                  <Th>GitHub URL</Th>
                  <Th>Demo URL</Th>
               </Tr>
            </Thead>
            <Tbody>
               {projects.map((project) => (
                  <Tr key={project.project_id}>
                     <Td>{project.project_name}</Td>
                     <Td>{project.team_id}</Td>
                     <Td>{project.description}</Td>
                     <Td>{project.github_url || "-"}</Td>
                     <Td>{project.demo_url || "-"}</Td>
                  </Tr>
               ))}
            </Tbody>
         </Table>
      </Box>
   );
};

export default HackathonProjects;
