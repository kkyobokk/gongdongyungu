import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
 
export default function Notfound(){
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/test');
    }, [])

    return <div>
        Hello World
    </div>
}