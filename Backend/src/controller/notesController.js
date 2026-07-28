import Note from "../models/Note.js";

export async function getAllNotes(_, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        return res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes:", error);
        return res.status(500).json({ message: "Error fetching notes", error: error.message });
    }
}

export async function CreateNode(req, res) {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }
        const note = new Note({ title, content });
        const savedNote = await note.save();
        return res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in CreateNode:", error);
        return res.status(500).json({ message: "Server error creating note", error: error.message });
    }
}

export async function UpdateNode(req, res) {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        return res.status(200).json({ message: "Note updated successfully", note: updatedNote });
    } catch (error) {
        console.error("Error in UpdateNode:", error);
        return res.status(500).json({ message: "Server error updating note", error: error.message });
    }
}

export async function Deletenode(req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        return res.status(200).json({ message: "Note deleted successfully", note: deletedNote });
    } catch (error) {
        console.error("Error in Deletenode:", error);
        return res.status(500).json({ message: "Server side issue deleting note", error: error.message });
    }
}

export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        return res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById:", error);
        return res.status(500).json({ message: "Server issue fetching note", error: error.message });
    }
}