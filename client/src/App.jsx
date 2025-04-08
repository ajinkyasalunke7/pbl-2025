import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { SnackbarProvider } from "notistack";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Hackathons from "./pages/Hackathons";
import Enroll from "./pages/Enroll";
import TeamMembers from "./pages/TeamMembers";
import AcceptInvitation from "./pages/AcceptInvitation";
import Profile from "./pages/Profile";
import TeamDetails from "./pages/TeamDetails";
import SubmitProject from "./pages/SubmitProject";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateHackathon from "./pages/CreateHackathon";
import HackathonProjects from "./pages/HackathonProjects";
import AssignJudge from "./pages/AssignJudge";
import AddPrize from "./pages/AddPrize";
import DeclareWinner from "./pages/DeclareWinner";
import AuthGuard from "./components/AuthGuard";

function App() {
   return (
      <ChakraProvider>
         <SnackbarProvider maxSnack={3}>
            <Router>
               <Navbar />
               <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                     path="/hackathons"
                     element={
                        <AuthGuard>
                           <Hackathons />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/enroll/:hackathonId"
                     element={
                        <AuthGuard>
                           <Enroll />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/teams/:teamId/members"
                     element={
                        <AuthGuard>
                           <TeamMembers />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/invitation/accept/:token"
                     element={<AcceptInvitation />}
                  />
                  <Route
                     path="/profile"
                     element={
                        <AuthGuard>
                           <Profile />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/teams/:teamId"
                     element={
                        <AuthGuard>
                           <TeamDetails />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/submit-project"
                     element={
                        <AuthGuard>
                           <SubmitProject />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/organizer/dashboard"
                     element={
                        <AuthGuard organizerOnly>
                           <OrganizerDashboard />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/organizer/create-hackathon"
                     element={
                        <AuthGuard organizerOnly>
                           <CreateHackathon />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/organizer/hackathons/:hackathonId/projects"
                     element={
                        <AuthGuard organizerOnly>
                           <HackathonProjects />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/organizer/hackathons/:hackathonId/assign-judge"
                     element={
                        <AuthGuard organizerOnly>
                           <AssignJudge />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/organizer/hackathons/:hackathonId/add-prize"
                     element={
                        <AuthGuard organizerOnly>
                           <AddPrize />
                        </AuthGuard>
                     }
                  />
                  <Route
                     path="/organizer/hackathons/:hackathonId/declare-winner"
                     element={
                        <AuthGuard organizerOnly>
                           <DeclareWinner />
                        </AuthGuard>
                     }
                  />
               </Routes>
            </Router>
         </SnackbarProvider>
      </ChakraProvider>
   );
}

export default App;
