import{d as r,r as t,o as d,c,a as h,w as f,_ as p,b as u,e}from"./index-Bx_c_906.js";const m={class:"Fetch"},_=e("tr",null,[e("th"),e("th",{colspan:"2",style:{"background-color":"ghostwhite"}},"User"),e("th"),e("th"),e("th")],-1),g=r({__name:"FetchView",setup(w){const l=t(),a=t(!1),i=t({page:1,rowsPerPage:5,orderBy:{},where:{}}),n=t([{title:"name",field:"name"},{title:"username",field:"username"},{title:"email",field:"email"},{title:"website",field:"website",sortable:!1,filterable:!1},{title:"address",field:"address.city"}]),o=t([]);return d(()=>{a.value=!0,fetch("https://jsonplaceholder.typicode.com/users").then(s=>s.json()).then(s=>o.value=[...s]).then(()=>a.value=!1)}),(s,v)=>(u(),c("div",m,[h(p,{ref_key:"tableRef",ref:l,"show-index":"",headers:n.value,items:o.value,"view-options":i.value,striped:"",loading:a.value},{"header-prepend":f(()=>[_]),_:1},8,["headers","items","view-options","loading"])]))}});export{g as default};
