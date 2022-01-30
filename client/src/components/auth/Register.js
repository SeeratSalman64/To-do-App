import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from 'axios';
import UserContext from '../../context/UserContext';
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";


const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });

    const history = useHistory();

    const { setUserData } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUser = { name, email, password, password2 };
            await Axios.post("http://localhost:5000/users/register", newUser);
            const loginRes = await Axios.post("http://localhost:5000/users/login", { email, password });
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user
            });
            localStorage.setItem("auth-token", loginRes.data.token);
            history.push("/");
        } catch (err) {
            if (err.response.data) {
                const error = err.response.data;
                setErrors({
                    name: error.name,
                    email: error.email,
                    password: error.password,
                    password2: error.password2
                });
            }
        }
    };

    return (
        <Container>
            <Form className="form" onSubmit={handleSubmit}>
                <div>
                    <p>
                        <b>Register</b> below
                    </p>
                    <p>
                        Already have an account?<Link to="/login">Log in</Link>
                    </p>
                </div>
                <FormGroup>
                    <Label for="name">
                        <b>Name</b>
                    </Label>
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your Name"
                        onChange={e => setName(e.target.value)}
                    />
                    <small className="red-text"> {errors.name} </small>
                </FormGroup>
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
                <FormGroup>
                    <Label for="password2">
                        <b>Confirm Password</b>
                    </Label>
                    <Input
                        type="password"
                        name="password2"
                        id="password2"
                        placeholder="Re-Enter your password"
                        onChange={e => setPassword2(e.target.value)}
                    />
                    <small className="red-text"> {errors.password2} </small>
                </FormGroup>
                <Button color="primary">Sign Up</Button>
            </Form>
        </Container>
    );
};

export default Register;
