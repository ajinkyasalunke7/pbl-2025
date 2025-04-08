import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { getHackathons } from "../api";

const Hackathons = () => {
   const [hackathons, setHackathons] = useState([]);
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const fetchHackathons = async () => {
         try {
            const { data } = await getHackathons();
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
         <Heading mb={4}>Available Hackathons</Heading>
         <Table variant="simple">
            <Table.Header>
               <Table.Row>
                  <Table.Header>Title</Table.Header>
                  <Table.Header>Start Date</Table.Header>
                  <Table.Header>End Date</Table.Header>
                  <Table.Header>Max Team Size</Table.Header>
                  <Table.Header>Action</Table.Header>
               </Table.Row>
            </Table.Header>
            <Table.Body>
               {hackathons.map((hackathon) => (
                  <Table.Row key={hackathon.hackathon_id}>
                     <Table.Cell>{hackathon.title}</Table.Cell>
                     <Table.Cell>
                        {new Date(hackathon.start_date).toLocaleDateString()}
                     </Table.Cell>
                     <Table.Cell>
                        {new Date(hackathon.end_date).toLocaleDateString()}
                     </Table.Cell>
                     <Table.Cell>{hackathon.max_team_size}</Table.Cell>
                     <Table.Cell>
                        <Button
                           colorScheme="teal"
                           onClick={() =>
                              navigate(`/enroll/${hackathon.hackathon_id}`)
                           }
                        >
                           Enroll
                        </Button>
                     </Table.Cell>
                  </Table.Row>
               ))}
            </Table.Body>
         </Table>
      </Box>
   );
};

export default Hackathons;
