import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
   Box,
   Button,
   Heading,
   Table,
   Tbody,
   Td,
   Th,
   Thead,
   Tr,
} from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { getOrganizerHackathons } from "../api";

const OrganizerDashboard = () => {
   const [hackathons, setHackathons] = useState([]);
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const fetchHackathons = async () => {
         try {
            const { data } = await getOrganizerHackathons();
            setHackathons(data.data);
         } catch (error) {
            enqueueSnackbar(
               error.response?.data.message || "Failed to fetch hackathons",
               { variant: "error" }
            );
         }
      };
      fetchHackathons();
   }, [enqueueSnackbar]);

   return (
      <Box p={8}>
         <Heading mb={4}>Organizer Dashboard</Heading>
         <Table variant="simple">
            <Thead>
               <Tr>
                  <Th>Title</Th>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                  <Th>Actions</Th>
               </Tr>
            </Thead>
            <Tbody>
               {hackathons.map((hackathon) => (
                  <Tr key={hackathon.hackathon_id}>
                     <Td>{hackathon.title}</Td>
                     <Td>
                        {new Date(hackathon.start_date).toLocaleDateString()}
                     </Td>
                     <Td>
                        {new Date(hackathon.end_date).toLocaleDateString()}
                     </Td>
                     <Td>
                        <Button
                           size="sm"
                           mr={2}
                           onClick={() =>
                              navigate(
                                 `/organizer/hackathons/${hackathon.hackathon_id}/projects`
                              )
                           }
                        >
                           Projects
                        </Button>
                        <Button
                           size="sm"
                           mr={2}
                           onClick={() =>
                              navigate(
                                 `/organizer/hackathons/${hackathon.hackathon_id}/assign-judge`
                              )
                           }
                        >
                           Assign Judge
                        </Button>
                        <Button
                           size="sm"
                           mr={2}
                           onClick={() =>
                              navigate(
                                 `/organizer/hackathons/${hackathon.hackathon_id}/add-prize`
                              )
                           }
                        >
                           Add Prize
                        </Button>
                        <Button
                           size="sm"
                           onClick={() =>
                              navigate(
                                 `/organizer/hackathons/${hackathon.hackathon_id}/declare-winner`
                              )
                           }
                        >
                           Declare Winner
                        </Button>
                     </Td>
                  </Tr>
               ))}
            </Tbody>
         </Table>
      </Box>
   );
};

export default OrganizerDashboard;
