import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Axios from 'axios';
import UserContext from '../../context/UserContext';
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const history = useHistory();

    const { setUserData } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginUser = { email, password };
            const loginRes = await Axios.post("http://localhost:5000/users/login", loginUser);
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user
            });
            localStorage.setItem("auth-token", loginRes.data.token);
            history.push("/");
        } catch (err) {
            console.log(err.response);
            if (err.response.data) {
                const error = err.response.data;
                setErrors({
                    email: error.email,
                    password: error.password || error.passwordincorrect
                });
            }
        }
    }

    return (
        <Container>
            <Form className="form" onSubmit={handleSubmit}>
                <div>
                    <p>
                        <b>Login</b> below
                    </p>
                    <p>
                        Don't have an account?<Link to="/register">Register</Link>
                    </p>
                </div>
                <FormGroup>
                    <Label for="email">
                        <b>Email</b>
                    </Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your Email"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <small className="red-text"> {errors.email} </small>
                </FormGroup>
                <FormGroup>
                    <Label for="password">
                        <b>Password</b>
                    </Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your Password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <small className="red-text"> {errors.password} </small>
                </FormGroup>
                <Button color="primary">Login</Button>
            </Form>
        </Container>
    )
}

export default Login;