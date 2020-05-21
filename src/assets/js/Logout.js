import axios from 'axios';
import { Message } from 'element-ui';
import router from '../../router';
import url from '../js/url'
export default {
    name:"logout",
    methods:{
      logout(){
        axios.get(url.baseURL+"/user/logout").then((response)=>{
          let res = response.data;
          if(res.state == 1){
            Message.success("登出成功");
            router.push('/home')
          }
        })
      }
    }
}

