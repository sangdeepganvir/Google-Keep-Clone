// Select the notes container element from the HTML document
const notesContainer = document.querySelector("#notes-container");

// Select the note input element from the HTML document
const noteInput = document.querySelector("#note-content");

// Select the "add note" button element from the HTML document
const addNoteBtn = document.querySelector(".add-note");

// Function that displays all notes in the notes container
function showNotes() {
    // Clear the notes container before displaying notes
    clearNotes();

    // Loop through all notes retrieved from localStorage and create a note element for each one
    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed);

        // Add the newly created note element to the notes container
        notesContainer.appendChild(noteElement);
    });
}

// Function that clears all notes from the notes container
function clearNotes() {
    // Replace all children of the notes container element with an empty array
    notesContainer.replaceChildren([]);
}

// Function that adds a new note to the notes container
function addNote() {
    // Get all notes from localStorage
    const notes = getNotes();

    // Create a new note object with a unique ID, the content from the note input, and a fixed status of false
    const noteObject = {
        id: generateId(),
        content: noteInput.value,
        fixed: false,
    };

    // Create a new note element with the note object's ID and content
    const noteElement = createNote(noteObject.id, noteObject.content);

    // Add the newly created note element to the notes container
    notesContainer.appendChild(noteElement);

    // Add the newly created note object to the array of notes
    notes.push(noteObject);

    // Save the updated notes array to localStorage
    saveNotes(notes);

    // Clear the note input after adding the new note
    noteInput.value = "";
};

// Function that generates a unique ID for each note
function generateId() {
    // Generate a random number between 0 and 5000
    return Math.floor(Math.random() * 5000);
}

// This function creates a new note element with the specified ID, content, and fixed status
function createNote(id, content, fixed) {
    const element = document.createElement("div"); // create a new div element
    element.classList.add("note"); // add the class "note" to the div element

    // create a new textarea element and set its value and placeholder attributes
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.placeholder = "Add Your Notes Here....";

    element.appendChild(textarea); // add the textarea element as a child of the div element

    // create new i elements for the pin, delete, and duplicate icons and add the appropriate classes to each
    const pinIcon = document.createElement("i");
    pinIcon.classList.add(...["bi", "bi-pin"]);
    element.appendChild(pinIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add(...["bi", "bi-x-lg"]);
    element.appendChild(deleteIcon);

    const duplicateIcon = document.createElement("i");
    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);
    element.appendChild(duplicateIcon);

    // if the note is fixed, add the class "fixed" to the div element
    if(fixed) {
        element.classList.add("fixed");
    };

    // add event listeners for the pin, delete, and duplicate icons that call the appropriate functions
    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id);
    });

    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id, element);
    });

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        copyNote(id);
    });

    return element; // return the finished note element
}

// This function toggles the fixed status of the note with the specified ID
function toggleFixNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0]; // get the target note from the list of notes

    targetNote.fixed = !targetNote.fixed; // toggle the fixed status

    saveNotes(notes); // save the updated list of notes to local storage

    showNotes(); // re-render the list of notes
}

// This function deletes the note with the specified ID and element from the list of notes
function deleteNote(id, element) {

    const notes = getNotes().filter((note) => note.id !== id); // filter out the note with the specified ID

    saveNotes(notes); // save the updated list of notes to local storage

    notesContainer.removeChild(element); // remove the note element from the DOM
}

// This function creates a copy of the note with the specified ID and adds it to the list of notes
function copyNote(id) {

    const notes = getNotes(); // get the list of notes

    const targetNote = notes.filter((note) => note.id === id)[0]; // get the target note from the list of notes

    // create a new note object with a unique ID and the same content as the target note, but with a fixed status of false
    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false,
    };

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed); // create a new note element based on the note object

    notesContainer.appendChild(noteElement); // add the new note element to the notes container

    notes.push(noteObject); // add the new note object to the notes container

    saveNotes(notes);

}

// This function retrieves the notes from the local storage,
// parses them from JSON format and sorts them by the 'fixed' property
function getNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const orderedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1: 1);

    return orderedNotes;
}

// This function saves the notes to local storage by stringifying them
function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// This event listener listens for a click on the add note button and calls the addNote() function
addNoteBtn.addEventListener("click", () => addNote());

// This function shows the notes on the page
showNotes();
