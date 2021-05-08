import {useState, useCallback, useEffect, useContext} from 'react';
import { AlertContext } from '../context/alert/alertContext';
import { useHttp } from './useHttp';


export const useTools = () => { 
    const [ready, setReady] = useState(false);

    const [timeIsGone, setTime] = useState(false);
    const [maxNumberOfApplications, setMaxNum] = useState(5);
    const alert = useContext(AlertContext);

    const { request } = useHttp();    

    const changeTime = useCallback(async(time)=>{
        try{
            setReady(false);
            const response = await request('/api/tools/time/change', 'POST', {time});
            if(!response.ok) throw new Error(response.message || 'Проблема загрузки времени');
            setTime(time);
            setReady(true);
        }catch(e){
            //alert.show(e.message || 'Что-то пошло не так', "danger");
            setReady(true);
        }
    }, [request, setTime]);

    const changeMaxNum = useCallback(async(maxnum)=>{
        try{
            setReady(false);
            const response = await request('/api/tools/maxnum/change', 'POST', {maxnum});
            if(!response.ok) throw new Error(response.message || 'Проблема загрузки времени');
            setMaxNum(maxnum);
            setReady(true);
        }catch(e){
            //alert.show(e.message || 'Что-то пошло не так', "danger");
            setReady(true);
        }
    }, [request, setMaxNum]);
    
    useEffect(() => {
        let cleanupFunction = false;  
        async function fetchData()   {
            try{
                setReady(false);
                const response = await request('/api/tools/time/');
                if(!response.ok) throw new Error(response.message || 'Проблема отримааня часу');
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

  useEffect(() => {
    let cleanupFunction = false;  
    async function fetchData()   {
        try{
            setReady(false);
            const response = await request('/api/tools/maxnum/');
            if(!response.ok) throw new Error(response.message || 'Проблема отримааня максимального числа заявок');
            if(!cleanupFunction) setMaxNum(response.maxNumberOfApplications);
            setReady(true);
        }catch(e){
            //alert.show(e.message || 'Что-то пошло не так', "danger");
            setReady(true);
        }     
    }
    fetchData();
    return () => cleanupFunction = true;     
}, [setTime,request , setReady, alert]);

  return {timeIsGone, changeTime, timeReady:ready, maxNumberOfApplications, changeMaxNum}
}
