import { useMe } from "../_hooks/useMe"
export const LoginUser:React.FC = () => {
    const {data,error} = useMe();
    if(!data) return null
    if(error) return <p>{error}</p>
    return <div>こんにちは、{data.name}さん</div>
}