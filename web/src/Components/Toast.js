import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import "../bootstrap/customDash.css";

const ToastAlert = () => {
	const [toastShow, toastSetShow] = useState(false);
	const ToastBody = (
		<Toast
			onClose={() => toastSetShow(!toastShow)}
			show={toastShow}
			id="toast-alert"
		>
			<Toast.Header>
				<strong className="mr-auto">twoNOTEZ</strong>
			</Toast.Header>
			<Toast.Body>
				Update & save, or remove your blank note before creating a new one.
			</Toast.Body>
		</Toast>
	);
	return { ToastBody, toastShow, toastSetShow };
};

export default ToastAlert;
