import {useState, useCallback, useEffect, useContext} from 'react';
import { AlertContext } from '../context/alert/alertContext';
import { useHttp } from './useHttp';


export const useTime = () => { 
    const [ready, setReady] = useState(false);

    const [timeIsGone, setTime] = useState(false);

    const alert = useContext(AlertContext);

    const { request } = useHttp();    

    const changeTime = useCallback(async(time)=>{
        try{
            setReady(false);
            const response = await request('/api/time/change', 'POST', {time});
            if(!response.ok) throw new Error(response.message || 'Проблема загрузки времени');
            setTime(time);
            setReady(true);



        }catch(e){
            //alert.show(e.message || 'Что-то пошло не так', "danger");
            setReady(true);
        }

    }, [request, setTime]);
    
    useEffect(() => {
        let cleanupFunction = false;  
        async function fetchData()   {
            try{
                setReady(false);
                const response = await request('/api/time/');
                if(!response.ok) throw new Error(response.message || 'Проблема загрузки времени');
                if(!cleanupFunction) setTime(response.time);
                setReady(true);
            }catch(e){
                //alert.show(e.message || 'Что-то пошло не так', "danger");
                setReady(true);
            }     
        }
        fetchData();
        return () => cleanupFunction = true;     
  }, [setTime,request , setReady, alert]);

  

  return {timeIsGone, changeTime, timeReady:ready  }
}