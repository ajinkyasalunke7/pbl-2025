import { Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const TeamMemberList = ({ members, onResend }) => {
   return (
      <Table variant="simple">
         <Thead>
            <Tr>
               <Th>Email</Th>
               <Th>Name</Th>
               <Th>College</Th>
               <Th>Gender</Th>
               <Th>Verified</Th>
               <Th>Action</Th>
            </Tr>
         </Thead>
         <Tbody>
            {members.map((member) => (
               <Tr key={member.user_id}>
                  <Td>{member.User.email}</Td>
                  <Td>{`${member.User.first_name} ${member.User.last_name}`}</Td>
                  <Td>{member.User.college_name}</Td>
                  <Td>{member.User.gender}</Td>
                  <Td>{member.verified ? "Yes" : "No"}</Td>
                  <Td>
                     {!member.verified && (
                        <Button
                           size="sm"
                           colorScheme="blue"
                           onClick={() => onResend(member.user_id)}
                        >
                           Resend
                        </Button>
                     )}
                  </Td>
               </Tr>
            ))}
         </Tbody>
      </Table>
   );
};

export default TeamMemberList;
