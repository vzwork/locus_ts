import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ContextProviderTheme } from "./contexts/ContextTheme/ContextTheme";
import Landing from "./pages/Landing";
import Background from "./components/Background/Background";
import { ContextProviderOnboardFlow } from "./contexts/ContextOnboardFlow/ContextOnboardFlow";
import Account from "./pages/Account/Account";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import PasswordChange from "./pages/Account/PasswordChange";
import EmailVerify from "./pages/Account/EmailVerify";
import SetUp from "./pages/Account/SetUp";
import Home from "./pages/Account/Home";
import Channels from "./pages/Channels/Channels";
import ChannelsError from "./pages/Channels/ChannelsError";
import AppBarHome from "./components/AppBar/AppBarHome";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const WrapperNavigation = () => {
  return (
    <>
      <ContextProviderOnboardFlow>
        <Outlet />
      </ContextProviderOnboardFlow>
    </>
  );
};

const WrapperHome = () => {
  return (
    <>
      <AppBarHome />
      <Background />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<WrapperNavigation />}>
      <Route element={<WrapperHome />}>
        <Route path="/" element={<Landing />} />
        <Route path="/account" element={<Account />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="passwordchange" element={<PasswordChange />} />
          <Route path="emailverify" element={<EmailVerify />} />
          <Route path="setup" element={<SetUp />} />
          <Route path="home" element={<Home />} />
        </Route>
      </Route>
      <Route path="/channels/:channelId" element={<Channels />} />
      <Route path="/channels/error" element={<ChannelsError />} />
    </Route>
  )
);

function App() {
  return (
    <ContextProviderTheme>
      <RouterProvider router={router} />
    </ContextProviderTheme>
  );
}

export default App;
