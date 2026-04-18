import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateMeeting from "./pages/CreateMeeting";
import Meeting from "./pages/Meeting";
import Invite from "./pages/Invite";
import Auth from "./pages/Auth";
import AppShell from "./components/AppShell";
import Availability from "./pages/Availability";
import Demo from "./pages/Demo";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create" element={<CreateMeeting />} />
          <Route path="/meeting/:id" element={<Meeting />} />
          <Route path="/invite/:id" element={<Invite />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
