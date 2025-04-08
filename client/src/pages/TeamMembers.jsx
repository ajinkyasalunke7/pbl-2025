import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { getTeamMembers, updateTeamMembers, resendInvitation } from "../api";
import TeamMemberForm from "../components/TeamMemberForm";
import TeamMemberList from "../components/TeamMemberList";

const TeamMembers = () => {
   const [members, setMembers] = useState([]);
   const [savedMembers, setSavedMembers] = useState([]);
   const { teamId } = useParams();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const fetchMembers = async () => {
         try {
            const { data } = await getTeamMembers(teamId);
            setSavedMembers(data.data);
         } catch (error) {
            enqueueSnackbar(
               error.response?.data.message || "Failed to fetch members",
               { variant: "error" }
            );
         }
      };
      fetchMembers();
   }, [teamId, enqueueSnackbar]);

   const handleAddMember = (member) => {
      setMembers((prev) => [...prev, member]);
   };

   const handleUpdate = async () => {
      try {
         const { data } = await updateTeamMembers(teamId, { members });
         setSavedMembers([
            ...savedMembers,
            ...data.data.invitations.map((inv, idx) => ({
               user_id: savedMembers.length + idx + 1,
               verified: false,
               User: members[idx],
            })),
         ]);
         setMembers([]);
         enqueueSnackbar(data.message, { variant: "success" });
      } catch (error) {
         enqueueSnackbar(error.response?.data.message || "Update failed", {
            variant: "error",
         });
      }
   };

   const handleResend = async (memberId) => {
      try {
         const { data } = await resendInvitation(teamId, memberId);
         enqueueSnackbar(data.message, { variant: "success" });
      } catch (error) {
         enqueueSnackbar(error.response?.data.message || "Resend failed", {
            variant: "error",
         });
      }
   };

   return (
      <Box p={8}>
         <Heading mb={4}>Manage Team Members</Heading>
         <VStack spacing={8} align="stretch">
            <TeamMemberForm onAddMember={handleAddMember} />
            {members.length > 0 && (
               <Button colorScheme="teal" onClick={handleUpdate}>
                  Update Team
               </Button>
            )}
            <TeamMemberList members={savedMembers} onResend={handleResend} />
         </VStack>
      </Box>
   );
};

export default TeamMembers;
