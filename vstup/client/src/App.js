//import logo from './logo.svg';
//import './App.css';
import { useRoutes } from "./routes/routes";
import {BrowserRouter} from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { Alert } from "./components/Alert";
import { AuthContext } from "./context/auth/authContext";
import { AlertState } from "./context/alert/AlertState";
import { useAuth } from "./hooks/useAuth";
import { Loader } from "./components/Loader";
import {TimeContext} from './context/timeContext'
import { useTime } from "./hooks/useTime";


function App() {
  const {isAdmin, isApplicant, adminLogin, adminLogout, logout, login, userId, ready} = useAuth();  
 const {timeIsGone, changeTime, timeReady} = useTime();

  
  const routes = useRoutes(isAdmin, isApplicant);  
  if (!ready || !timeReady) {
    return <Loader/>
  }
  
  return (
    <BrowserRouter> <AlertState> 
    
    <TimeContext.Provider value={{timeIsGone, changeTime}}>
    <AuthContext.Provider value={{isAdmin, isApplicant, adminLogin, adminLogout, logout, login, userId, ready}}>
                       
          <NavBar/>   
          <Alert/>
          {routes}   
          <Footer/>
      
    </AuthContext.Provider>
    </TimeContext.Provider>
    </AlertState>
    </BrowserRouter>     
  );
}

export default App;
