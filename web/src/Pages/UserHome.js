import React, { useState, useEffect } from "react";

import {
	Form,
	Button,
	Card,
	CardColumns,
	Nav,
	//NavDropdown,
	Container,
	Row,
	Col,
	Toast,
	CloseButton,
} from "react-bootstrap";
//import UserContext from "../Components/Context/UserContext";
import "../bootstrap/customDash.css";
//import ToastAlert from "../Components/Toast";
import useNoteUpdate from "../Components/CustomHooks/useNoteUpdate";

const UserHome = () => {
	/*
	NOT IN USE CURRENTLY
	const noteDataStructure = [
		{
			body: "",
			category: "",
			last_updated: Date.now(),
			nid: "",
			title: "",
			uid: "",
			user_edit: true,
		},
	];
	*/
	const [notes, setNotes] = useState([]);
	const [editNote, setEditNote] = useState(false);
	const [noteEditState, setNoteEditState] = useState(0);
	const [noteEditID, setNoteEditID] = useState(null);
	const [toastShow, toastSetShow] = useState(false);

	const getNotes = async (callback) => {
		const response = await fetch("http://localhost:8080/getNotes", {
			method: "GET",
			credentials: "include",
		});
		const data = await response.json();
		if (data.notes) {
			callback(data.notes);
		}
	};

	const findNote = (card) => {
		return notes.find(({ nid }) => nid === card);
	};
	/*
	NOT IN USE CURRENTLY 
	function noteChange(card, category, title, body) {
		let userUpdate = { nid: card, category: category, title: title, body: body };
		const niq = findNote(card);
	}
	*/

	const ToastBody = () => {
		return (
			<Toast
				onClose={() => toastSetShow(!toastShow)}
				show={toastShow}
				id="toast-alert"
				autohide
			>
				<Toast.Header>
					<strong className="mr-auto">twoNOTEZ</strong>
				</Toast.Header>
				<Toast.Body>
					Update & save, or remove your blank note before creating or editing
					another.
				</Toast.Body>
			</Toast>
		);
	};

	const updateNote = async () => {
		const response = await fetch("http://localhost:8080/updateNote", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
			withCredentials: true,
			body: JSON.stringify(inputs),
		});
		const data = await response.json();
		console.log(data);
		// do I need to update DOM after updateNOTE?
		// do I need to call setNOTES with data?
	};
	const { inputs, handleInputChange, handleSubmit } = useNoteUpdate(updateNote);

	const userEdit = (card) => {
		const niq = findNote(card);
		niq.user_edit = !niq.user_edit; // I want to get away from editing state that is not directly incoming from the db
		setEditNote(!editNote);
	};

	const updateCalc = (mins) => {
		if (mins < 60) {
			return mins + " minutes ago";
		} else if (mins < 60 * 24) {
			return Math.floor(mins / 60) + " hours ago";
		} else {
			return Math.floor(mins / (60 * 24)) + " days ago";
		}
	};

	useEffect(() => {
		getNotes(setNotes);
	}, []);

	const createNote = async () => {
		if (
			notesShallowCopyReverse.length !== 0 &&
			notesShallowCopyReverse[0].category === "category" //this needs actual error handling
		) {
			// if blank note has been added and not updated show toast
			toastSetShow(!toastShow);
			console.log("toast");
			return;
		} else {
			// create new note in db
			const response = await fetch("http://localhost:8080/createNote", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				credentials: "include",
				withCredentials: true,
			});
			const data = await response.json();
			console.log(data);
			//need to figure out how to handle data
			getNotes(setNotes);
		}
	};

	let unlockInput = noteEditID
		? "note-category-input-unlocked"
		: "note-category-input";
	let notesShallowCopyReverse = [...notes].reverse();

	const cardsForms = notesShallowCopyReverse.map((note) => (
		<div key={note.nid}>
			<Card style={{ width: "18rem" }}>
				<Container>
					<Row md={6}>
						<Col>
							<div>
								{note.user_edit ? (
									<CloseButton
										id="close-button"
										variant="white"
										onClick={() => {
											console.log("delete note");
										}}
									></CloseButton>
								) : null}
							</div>
						</Col>
					</Row>
				</Container>

				<Form>
					<Card.Header id="card-header">
						<Form.Group>
							<Form.Control
								className="shadow-none"
								name="category"
								type={note.nid}
								plaintext
								id={unlockInput}
								readOnly={!note.user_edit}
								defaultValue={note.category}
								onChange={handleInputChange}
							/>
						</Form.Group>
					</Card.Header>
					<Card.Body>
						<Form.Group>
							<Form.Control
								className="shadow-none"
								name="title"
								type={note.nid}
								plaintext
								id={unlockInput}
								readOnly={!note.user_edit}
								defaultValue={note.title}
								onChange={handleInputChange}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Control
								className="shadow-none"
								name="body"
								type={note.nid}
								as="textarea"
								rows="3"
								id={unlockInput}
								readOnly={!note.user_edit}
								defaultValue={note.body}
								onChange={handleInputChange}
							/>
						</Form.Group>
						<Button
							variant="link"
							className="note-button"
							size="sm"
							onClick={() => {
								// if edit is selected change to edit note state
								if (noteEditState === true && noteEditID !== note.nid) {
									//if a note is already open for editng -> set toast
									toastSetShow(!toastShow);
									console.log(noteEditID);
								} else if (noteEditState === true && noteEditID === note.nid) {
									//if save is clicked and a change has occured -> update db
									handleSubmit();
									userEdit(note.nid);
									setNoteEditID(null);
									setNoteEditState(!noteEditState);
								} else {
									// no notes are open for editing -> open edit note
									setNoteEditState(!noteEditState);
									setNoteEditID(note.nid);
									userEdit(note.nid);
								}
							}}
						>
							{note.user_edit ? "Save" : "Edit"}
						</Button>
					</Card.Body>
				</Form>
				<Card.Footer>
					<small className="text-muted">
						Last updated{" "}
						{updateCalc(
							Math.round((Date.now() - Date.parse(note.last_updated)) / 60000, 1)
						)}
					</small>
				</Card.Footer>
			</Card>
		</div>
	));

	return (
		<Container fluid>
			<Row>
				<Col md={2} className="p-0 d-md-block d-none" id="sidebar-wrapper">
					<Nav className="bg-light flex-column">
						<div className="mt-3 sidebar-sticky">
							<Button
								variant="link"
								className="nav-button"
								onClick={() => {
									createNote();
								}}
							>
								Create Note
							</Button>
							<Nav.Item>
								<Nav.Link>Active</Nav.Link>
							</Nav.Item>
						</div>
					</Nav>
				</Col>
				<Col md={10} className="px-4 mt-4">
					<Row>
						<React.StrictMode>
							<Col xs={6} className="mb-2">
								{toastShow ? <ToastBody /> : null}
							</Col>
						</React.StrictMode>
					</Row>
					<CardColumns id="">
						{notes.length === 0 ? <div></div> : cardsForms}
					</CardColumns>
				</Col>
			</Row>
		</Container>
	);
};

export default UserHome;
