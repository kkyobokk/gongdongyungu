import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
 
export default function Notfound(){
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if(location.pathname !== "/") alert("Not Found Page");
        navigate('/test');
    }, [])

    return <div>
        404 Not Found Page
    </div>
}