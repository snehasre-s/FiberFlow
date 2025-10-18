import axios from "../../api/axios";
import { useEffect, useState } from "react";

export default function Inventory(){
    const [assets, setAssets]= useState([]);

    useEffect(()=>{
        axios.get("/assets").then(res=>setAssets(res.data));
    } ,[]);

    return(
        <div>
            <h2>Asset Inventory</h2>
            <ul>
                {assets.map(a=>(
                    <li key={a.id}>{a.type}-{a.status}</li>
                ))}
            </ul>
        </div>
    );
}
