import {Request} from "../../utils/request";
export const fetchItem=(params)=>{
    return Request.post('/fetchItem',params).then(res=>{
        return res.item
    })
}
