import { HOST }  from '@/Utils/constants';
//changed from '' to ""
import  axios  from "axios";


export const apiClient = axios.create({
   //added coma
    baseURL: HOST,
});

