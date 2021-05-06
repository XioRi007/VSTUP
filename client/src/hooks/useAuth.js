import {useState, useCallback, useEffect} from 'react';
const storageName = 'userData'


export const useAuth = () => {

  const [ready, setReady] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isApplicant, setApplicant] = useState(false);
  const [userId, setUserId] = useState(null);

  const logout = useCallback(() => {    
    setUserId(null);  
    setApplicant(false);
    localStorage.removeItem(storageName);   
  }, []);

  const adminLogin = useCallback(()=>{
    logout();
    setAdmin(true);
    setUserId('admin');   
    localStorage.setItem(storageName, JSON.stringify({
        userId: 'admin'
    }));   
  }, [logout]);


  const adminLogout = useCallback(()=>{
    setAdmin(false);
    setUserId(null); 
    localStorage.removeItem(storageName);  
  }, []);


  const login = useCallback((id) => {
    adminLogout();
    setUserId(id);   
    setApplicant(true);
    localStorage.setItem(storageName, JSON.stringify({
        userId: id
    }));     
  }, [adminLogout]);


  

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));  
    if (data && data.userId) {
      if(data.userId === 'admin'){
        adminLogin();  
      }else{
        login(data.userId)
      }            
    }
    setReady(true);
  }, [login, adminLogin]);


  return { isAdmin, isApplicant, adminLogin, adminLogout, logout, login, userId, ready }
}