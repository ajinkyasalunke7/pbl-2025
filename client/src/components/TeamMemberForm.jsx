import { useState } from "react";
import {
   Button,
   FormControl,
   FormLabel,
   Input,
   Select,
   VStack,
} from "@chakra-ui/react";

const TeamMemberForm = ({ onAddMember }) => {
   const [member, setMember] = useState({
      email: "",
      first_name: "",
      last_name: "",
      college_name: "",
      gender: "",
   });

   const handleChange = (e) => {
      setMember({ ...member, [e.target.name]: e.target.value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      onAddMember(member);
      setMember({
         email: "",
         first_name: "",
         last_name: "",
         college_name: "",
         gender: "",
      });
   };

   return (
      <form onSubmit={handleSubmit}>
         <VStack spacing={4}>
            <FormControl>
               <FormLabel>Email</FormLabel>
               <Input
                  name="email"
                  value={member.email}
                  onChange={handleChange}
                  required
               />
            </FormControl>
            <FormControl>
               <FormLabel>First Name</FormLabel>
               <Input
                  name="first_name"
                  value={member.first_name}
                  onChange={handleChange}
                  required
               />
            </FormControl>
            <FormControl>
               <FormLabel>Last Name</FormLabel>
               <Input
                  name="last_name"
                  value={member.last_name}
                  onChange={handleChange}
                  required
               />
            </FormControl>
            <FormControl>
               <FormLabel>College Name</FormLabel>
               <Input
                  name="college_name"
                  value={member.college_name}
                  onChange={handleChange}
                  required
               />
            </FormControl>
            <FormControl>
               <FormLabel>Gender</FormLabel>
               <Select
                  name="gender"
                  value={member.gender}
                  onChange={handleChange}
                  required
               >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
               </Select>
            </FormControl>
            <Button type="submit" colorScheme="teal">
               Add Member
            </Button>
         </VStack>
      </form>
   );
};

export default TeamMemberForm;
