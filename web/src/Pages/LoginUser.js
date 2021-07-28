import React, { useContext, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import useLogin from "../Components/CustomHooks/useLogin";
import { useHistory } from "react-router-dom";
import UserContext from "../Components/Context/UserContext";
import FetchContext from "../Components/Context/FetchContext";

const LoginUser = () => {
	let history = useHistory();
	//const [editing, setEditing] = useState(false);
	const [errors, setErrors] = useState(null);
	const { setUser } = useContext(UserContext);
	const { setFetching } = useContext(FetchContext);
	const login = async () => {
		setFetching(true);
		const response = await fetch("http://localhost:8080/login", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
			withCredentials: true,
			body: JSON.stringify(inputs),
		});
		const data = await response.json();
		if (data.user) {
			setUser(data.user);
			setFetching(false);
		} else {
			setErrors(data.errors[0]);
			setFetching(false);
			return;
		}
		history.push("/");
	};

	const { inputs, handleInputChange, handleSubmit } = useLogin(login);

	return (
		<div className="d-flex justify-content-center mt-5">
			<div className="form-signin" style={{ width: "400px" }}>
				<Form className="mt-3" onSubmit={handleSubmit}>
					<Form.Group as={Row}>
						<Col /*sm={{ Span: 9, offset: 3 }}*/>
							<h3>Login</h3>
						</Col>
					</Form.Group>
					<Form.Group as={Row} controlId="loginEmailOrUsername">
						<Form.Label column sm={3}>
							User
						</Form.Label>
						<Col sm={9}>
							<Form.Control
								name="emailOrUsername"
								type="emailorUsername"
								placeholder="Email or Username"
								onChange={handleInputChange}
								value={inputs.emailorUsername}
							/>
							<Form.Text mt={2} sm={{ Span: 9, offset: 3 }} className="text-danger">
								{errors && errors.field === "emailOrUsername" ? errors.message : null}
							</Form.Text>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="registerPassword">
						<Form.Label column sm={3}>
							Password
						</Form.Label>
						<Col sm={9}>
							<Form.Control
								name="password"
								type="password"
								placeholder="Password"
								onChange={handleInputChange}
								value={inputs.password}
							/>
							<Form.Text mt={2} sm={{ Span: 9, offset: 3 }} className="text-danger">
								{errors && errors.field === "password" ? errors.message : null}
							</Form.Text>
						</Col>
					</Form.Group>
					<Form.Group as={Row} controlId="formSubmitLogin">
						<Col sm={{ offset: 8 }}>
							<Button
								className="text-center align-center mt-3"
								variant="dark"
								type="Submit"
							>
								Login
							</Button>
						</Col>
					</Form.Group>
				</Form>
			</div>
		</div>
	);
};

export default LoginUser;
