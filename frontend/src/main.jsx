import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Test from './test/Test.jsx'
import FormCard from './components/form/FormCard.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import Profile from './components/profile/Profile.jsx'
import PollVote from './components/poll vote/PollVote.jsx'
import ProjectsAssignment from './components/projects/ProjectsAssignment.jsx'
import ProjectsDragAssign from './components/projects/ProjectsDragAssign.jsx'
import ProjectForm from './components/projects/ProjectForm.jsx'
import ViewProfile from './components/profile/ViewProfile.jsx'
import Login from './components/login/Login.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Dashboard />}/>
      <Route path='/viewAllIntern' element={<Profile />}/>
      <Route path='/dashboard' element={<Dashboard />}/>
      <Route path='/form' element={<FormCard/>}/>
      <Route path='/pollVote' element={<PollVote />}/>
      <Route path='/createProject' element={<ProjectForm />}/>
      <Route path='/projectAssignment' element={<ProjectsAssignment />}/>
      <Route path='/projectsDragAssign' element={<ProjectsDragAssign />}/>
      <Route path="/profileDetails" element={<ViewProfile />} />
      <Route path="/admin" element={<Login />} />
      <Route path='/test' element={<Test />}/>
    </Routes>
    </BrowserRouter>
  // </StrictMode>,
)
