import { useCallback, useContext} from 'react'
import { useHistory } from 'react-router';
import { AlertContext } from '../context/alert/alertContext';
import { useHttp } from './useHttp';

export const useLoad = () => {
    const history = useHistory();
    const {request} = useHttp();  
    const alert = useContext(AlertContext); 
    
    
    const loadSubjects = useCallback( async (cleanupFunction, setSubjects)=>{
        try{
            const {primary, secondary, custom, last} = await request('/api/zno/get');            
           
            if(!cleanupFunction) setSubjects({primary, secondary, custom, last}) ;  
           
        }catch(e){
            alert.show(e.message, 'danger');
            history.push('/'); 
        }
        // eslint-disable-next-line
    }, [request, alert.show, history]);
  
    const loadFaculties = useCallback( async (cleanupFunction, setFaculties, length )=>{
        if(length) return;
        try{
            const {Faculties} = await request('/api/specialty/get/faculties');
            if (!Faculties)
                throw new Error('Ошибка загрузки факультетов');                      
            if(!cleanupFunction) setFaculties(Faculties);  
        }catch(e){
            alert.show(e.message, 'danger');
            history.push('/'); 
        }        
    }, [request, alert, history]);         
    
    
    const loadSpecialties = useCallback( async (faculty, cleanupFunction, setSpecialties)=>{
        if (!faculty)        
            return;
        try{
            const {Specialties} =await request(`/api/specialty/get/specialty/${faculty}`);
            if (!Specialties)
                throw new Error('Ошибка загрузки специальностей');                      
            if(!cleanupFunction) setSpecialties(Specialties);         
        }catch(e){
            alert.show(e.message, 'danger');
            history.push('/'); 
        }
                
    }, [request, alert, history]); 

    
 

  return { loadSubjects, loadFaculties, loadSpecialties }
}

/**
 * 
 * useEffect(()=>{
        let cleanupFunction = false;
        loadSubjects(cleanupFunction, setSubjects);
        return () => cleanupFunction = true;       
    
    }, [loadSubjects, setSubjects]);

    useEffect(()=>{
        let cleanupFunction = false;
        loadSpecialties(form.Faculty, cleanupFunction, setSpecialties);
        return () => cleanupFunction = true;       
    
        }, [loadSpecialties, setSpecialties, form.Faculty]);

    
    useEffect(()=>{
        let cleanupFunction = false;
        loadFaculties(cleanupFunction, setFaculties, faculties.length);
        return () => cleanupFunction = true;       
    
        }, [loadFaculties, setFaculties, faculties.length]);
 
    
 */