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
import { getTeamDetails } from "../api";

const TeamDetails = () => {
   const [team, setTeam] = useState(null);
   const { teamId } = useParams();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const fetchTeam = async () => {
         try {
            const { data } = await getTeamDetails(teamId);
            setTeam(data.data);
         } catch (error) {
            enqueueSnackbar(
               error.response?.data.message || "Failed to fetch team details",
               { variant: "error" }
            );
         }
      };
      fetchTeam();
   }, [teamId, enqueueSnackbar]);

   if (!team) return <Box p={8}>Loading...</Box>;

   return (
      <Box p={8}>
         <Heading mb={4}>{team.team_name}</Heading>
         <Text>
            Leader: {team.teamLeader.first_name} {team.teamLeader.last_name}
         </Text>
         <Table variant="simple" mt={4}>
            <Thead>
               <Tr>
                  <Th>Email</Th>
                  <Th>Name</Th>
                  <Th>College</Th>
                  <Th>Gender</Th>
                  <Th>Verified</Th>
               </Tr>
            </Thead>
            <Tbody>
               {team.TeamMembers.map((member) => (
                  <Tr key={member.user_id}>
                     <Td>{member.User.email}</Td>
                     <Td>{`${member.User.first_name} ${member.User.last_name}`}</Td>
                     <Td>{member.User.college_name}</Td>
                     <Td>{member.User.gender}</Td>
                     <Td>{member.verified ? "Yes" : "No"}</Td>
                  </Tr>
               ))}
            </Tbody>
         </Table>
      </Box>
   );
};

export default TeamDetails;
