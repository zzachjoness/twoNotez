import React, { useContext, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import useRegister from "../Components/CustomHooks/useRegister";
import UserContext from "../Components/Context/UserContext";

const RegisterUser = () => {
	const history = useHistory();
	const { setUser } = useContext(UserContext);
	const [errors, setErrors] = useState(null);
	const register = async () => {
		const response = await fetch("http://localhost:8080/register", {
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
			history.push("/");
		} else {
			setErrors(data.errors[0]);
		}
	};

	const { inputs, handleInputChange, handleSubmit } = useRegister(register);

	return (
		<div className="d-flex justify-content-center mt-5">
			<div className="form-signin" style={{ width: "400px" }}>
				<Form className="mt-3" onSubmit={handleSubmit}>
					<Form.Group as={Row}>
						<Col /*sm={{ Span: 9, offset: 3 }}*/>
							<h3>Regsiter</h3>
						</Col>
					</Form.Group>
					<Form.Group as={Row} controlId="registerEmail">
						<Form.Label column sm={3}>
							Email
						</Form.Label>
						<Col sm={9}>
							<Form.Control
								name="email"
								type="email"
								placeholder="Email"
								onChange={handleInputChange}
								value={inputs.email}
							/>
							<Form.Text mt={2} sm={{ Span: 9, offset: 3 }} className="text-danger">
								{errors && errors.field === "email" ? errors.message : null}
							</Form.Text>
						</Col>
					</Form.Group>
					<Form.Group as={Row} controlId="registerUsername">
						<Form.Label column sm={3}>
							Username
						</Form.Label>
						<Col sm={9}>
							<Form.Control
								name="username"
								type="username"
								placeholder="Username"
								onChange={handleInputChange}
								value={inputs.username}
							/>
							<Form.Text mt={2} sm={{ Span: 9, offset: 3 }} className="text-danger">
								{errors && errors.field === "username" ? errors.message : null}
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
					<Form.Group as={Row} controlId="formSubmitRegsiter">
						<Col sm={{ offset: 8 }}>
							<Button
								className="text-center align-center mt-3"
								variant="dark"
								type="Submit"
							>
								Register
							</Button>
						</Col>
					</Form.Group>
				</Form>
			</div>
		</div>
	);
};

export default RegisterUser;
