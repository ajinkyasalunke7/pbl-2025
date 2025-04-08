import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Text } from "@chakra-ui/react";
import { useSnackbar } from "notistack";
import { acceptInvitation } from "../api";

const AcceptInvitation = () => {
   const { token } = useParams();
   const navigate = useNavigate();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const handleAccept = async () => {
         try {
            const { data } = await acceptInvitation(token);
            if (data.data?.email) {
               enqueueSnackbar("Please register first", { variant: "info" });
               navigate("/register", { state: { email: data.data.email } });
            } else {
               enqueueSnackbar(data.message, { variant: "success" });
               navigate("/profile");
            }
         } catch (error) {
            enqueueSnackbar(
               error.response?.data.message || "Failed to accept invitation",
               { variant: "error" }
            );
            navigate("/login");
         }
      };
      if (localStorage.getItem("token")) handleAccept();
   }, [token, navigate, enqueueSnackbar]);

   return (
      <Box p={8} textAlign="center">
         <Text>Please log in to accept the invitation</Text>
         <Button mt={4} onClick={() => navigate("/login")}>
            Login
         </Button>
      </Box>
   );
};

export default AcceptInvitation;
