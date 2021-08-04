import React, { useState, useEffect } from "react";

import {
	Form,
	Button,
	Card,
	CardColumns,
	Nav,
	Container,
	Row,
	Col,
	Toast,
} from "react-bootstrap";
import "../bootstrap/userHome.css";
import useNoteUpdate from "../Components/CustomHooks/useNoteUpdate";
import getNotes from "../Components/Queries/getNotes";

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
	const [toastShow, setToastShow] = useState(false);
	const [warningShow, setWarningShow] = useState(false);
	const [noteDeleteID, setNoteDeleteID] = useState(null);

	/*
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
	*/
	const deleteNote = async () => {
		const response = await fetch("http://localhost:8080/deleteNote", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
			withCredentials: true,
			body: JSON.stringify({ nid: noteDeleteID }),
		});
		const data = await response.json();
		console.log(data);
		/*if (data.notes) {
			setNotes(data.notes);
			setNoteDeleteID(null);
		}*/
	};

	const findNote = (card) => {
		return notes.find(({ nid }) => nid === card);
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

	const createNote = async () => {
		if (
			notesShallowCopyReverse.length !== 0 &&
			notesShallowCopyReverse[0].category === "category" //this needs actual error handling
		) {
			// if blank note has been added and not updated show toast
			setToastShow(!toastShow);
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

	const ToastBody = () => {
		return (
			<Toast
				onClose={() => setToastShow(!toastShow)}
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
	const DeleteToast = () => {
		return (
			<Toast
				onClose={() => setWarningShow(!warningShow)}
				show={warningShow}
				id="toast-delete"
				onClick={() => {
					setWarningShow(!warningShow);
				}}
			>
				<Toast.Header>
					<strong className="mr-auto">twoNOTEZ</strong>
				</Toast.Header>
				<Toast.Body>Are you sure you want to delete this note?</Toast.Body>
				<Button variant="link" className="note-button" size="sm">
					Cancel
				</Button>
				<Button
					id="delete-button"
					variant="link"
					size="sm"
					onClick={() => {
						setWarningShow(!warningShow);
						deleteNote();
					}}
				>
					Delete
				</Button>
			</Toast>
		);
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
		console.log("useEffect");
	}, []);

	const cardsForms = notesShallowCopyReverse.map((note) => (
		<div key={note.nid}>
			<Card style={{ width: "18rem" }}>
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
									setToastShow(!toastShow);
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
						<Button
							id="delete-button"
							variant="link"
							size="sm"
							onClick={() => {
								setWarningShow(!warningShow);
								DeleteToast();
								setNoteDeleteID(note.nid);
							}}
						>
							{note.user_edit ? "Delete" : null}
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
								{toastShow ? <ToastBody /> : warningShow ? <DeleteToast /> : null}
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
