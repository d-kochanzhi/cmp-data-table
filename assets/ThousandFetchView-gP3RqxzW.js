import{d as r,r as t,o as d,c,a as h,w as f,_ as p,b as u,e}from"./index-Bx_c_906.js";const _={class:"Fetch"},m=e("tr",null,[e("th"),e("th",{colspan:"2",style:{"background-color":"ghostwhite"}},"User"),e("th"),e("th"),e("th")],-1),y=r({__name:"ThousandFetchView",setup(v){const n=t(),s=t(!1),i=t({page:1,rowsPerPage:50,orderBy:{},where:{}}),l=t([{title:"name",field:"firstname"},{title:"last",field:"yourlastname"},{title:"email",field:"email"},{title:"city",field:"city"},{title:"date",field:"date_value"}]),o=t([]);return d(()=>{s.value=!0,fetch("/data/10000.json",{headers:{"Content-Type":"application/json"}}).then(a=>a.json()).then(a=>o.value=[...a]).then(()=>s.value=!1)}),(a,w)=>(u(),c("div",_,[h(p,{ref_key:"tableRef",ref:n,"show-index":"",headers:l.value,items:o.value,"view-options":i.value,striped:"",loading:s.value},{"header-prepend":f(()=>[m]),_:1},8,["headers","items","view-options","loading"])]))}});export{y as default};
