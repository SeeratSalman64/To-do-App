import React, { useContext } from 'react';
import { Container, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import Home from './home';

const Landing = () => {

    const { userData, setUserData } = useContext(UserContext);
    console.log(userData);

    let history = useHistory();

    const register = () => history.push("/register");
    const login = () => history.push("/login");
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        });
        localStorage.setItem("auth-token", "");
    }

    return (
        <Container className="box">
            <Home />
            <div className="row buttons">
                {userData.user ? <div className="col-12">
                    <Button color="primary" onClick={logout}>Logout</Button>
                </div> :
                    <><div className="col-6">
                        <Button color="primary" onClick={register}>Register</Button>
                    </div>
                        <div className="col-6">
                            <Button color="primary" onClick={login}>Login</Button>
                        </div></>}
            </div>
        </Container>
    )
}

export default Landing;