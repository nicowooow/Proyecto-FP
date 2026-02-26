import { useAuth } from "../components/auth";

function Log_out(){
    let {logout} = useAuth();

    return(
        <main>
            <h1>Log out</h1>
        </main>
    )
}

export default Log_out;