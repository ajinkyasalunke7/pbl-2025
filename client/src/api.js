import axios from "axios";

const api = axios.create({
   baseURL: import.meta.env.VITE_BACKEND_URL,
});

const setAuthToken = (token) => {
   if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
   } else {
      delete api.defaults.headers.common["Authorization"];
   }
};

// User Routes
export const register = (data) => api.post("/user/register", data);
export const login = (data) => api.post("/user/login", data);
export const getHackathons = () => api.get("/user/hackathons");
export const enrollInHackathon = (data) => api.post("/user/enroll", data);
export const updateTeamMembers = (teamId, data) =>
   api.put(`/user/teams/${teamId}/members`, data);
export const getTeamMembers = (teamId) =>
   api.get(`/user/teams/${teamId}/members`);
export const resendInvitation = (teamId, memberId) =>
   api.post(`/user/teams/${teamId}/members/${memberId}/resend`);
export const acceptInvitation = (token) =>
   api.get(`/user/invitation/accept/${token}`);
export const updateProfile = (data) => api.put("/user/profile", data);
export const getTeamDetails = (teamId) => api.get(`/user/teams/${teamId}`);
export const submitProject = (data) => api.post("/user/projects", data);

// Organizer Routes
export const createHackathon = (data) =>
   api.post("/organizer/hackathons", data);
export const getOrganizerHackathons = () => api.get("/organizer/hackathons");
export const getHackathonProjects = (hackathonId) =>
   api.get(`/organizer/hackathons/${hackathonId}/projects`);
export const assignJudge = (hackathonId, data) =>
   api.post(`/organizer/hackathons/${hackathonId}/judges`, data);
export const addPrize = (hackathonId, data) =>
   api.post(`/organizer/hackathons/${hackathonId}/prizes`, data);
export const declareWinner = (hackathonId, data) =>
   api.post(`/organizer/hackathons/${hackathonId}/winners`, data);

export { setAuthToken };
