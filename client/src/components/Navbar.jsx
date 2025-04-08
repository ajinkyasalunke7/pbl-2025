import { useNavigate } from "react-router-dom";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useSnackbar } from "notistack";

const Navbar = () => {
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();
   const token = localStorage.getItem("token");
   const userType = localStorage.getItem("userType");

   const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      enqueueSnackbar("Logged out successfully", { variant: "success" });
      navigate("/login");
   };

   return (
      <Flex
         p={4}
         bg="teal.500"
         color="white"
         justify="space-between"
         align="center"
      >
         <Text
            fontSize="xl"
            fontWeight="bold"
            onClick={() => navigate("/")}
            cursor="pointer"
         >
            Hackathon Platform
         </Text>
         <Flex gap={4}>
            {token ? (
               <>
                  {userType === "organizer" ? (
                     <>
                        <Button
                           onClick={() => navigate("/organizer/dashboard")}
                        >
                           Dashboard
                        </Button>
                        <Button
                           onClick={() =>
                              navigate("/organizer/create-hackathon")
                           }
                        >
                           Create Hackathon
                        </Button>
                     </>
                  ) : (
                     <>
                        <Button onClick={() => navigate("/hackathons")}>
                           Hackathons
                        </Button>
                        <Button onClick={() => navigate("/profile")}>
                           Profile
                        </Button>
                     </>
                  )}
                  <Button onClick={handleLogout}>Logout</Button>
               </>
            ) : (
               <>
                  <Button onClick={() => navigate("/login")}>Login</Button>
                  <Button onClick={() => navigate("/register")}>
                     Register
                  </Button>
               </>
            )}
         </Flex>
      </Flex>
   );
};

export default Navbar;
