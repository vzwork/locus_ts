import { Box } from "@mui/material";

import Theme from "./Theme";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Background from "./components/Background/Background";
import ManagerAccount from "./data/_1_ManagerAccount/ManagerAccount";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import ManagerSession from "./data/_2_ManagerSession/ManagerSession";
import Channels from "./pages/Channels";
import Posts from "./pages/Posts";
import ManagerChannels from "./data/_7_ManagerChannels/ManagerChannels";

const WrapperBackground = () => {
  return (
    <>
      <Background />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route>
      <Route element={<WrapperBackground />}>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Route>
      <Route path="/channels/:id" element={<Channels />}>
        <Route path="posts/:id" element={<Posts />} />
      </Route>
    </Route>
  )
);

export default function App() {
  const managerAccount = ManagerAccount;
  managerAccount.init();
  const managerSession = ManagerSession;
  managerSession.init();
  const managerChannels = ManagerChannels;
  managerChannels.init();

  return (
    <>
      <Theme>
        <Box
          sx={{ width: "100vw", height: "100vh" }}
          bgcolor="background.default"
          color="text.primary"
        >
          <RouterProvider router={router} />
        </Box>
      </Theme>
    </>
  );
}
