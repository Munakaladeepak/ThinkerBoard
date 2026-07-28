import React, { useEffect, useState } from "react";
import RateLimited from "../components/RateLimited";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";
import NoteNotFound from "../components/NoteNotFound";
const Homepage = () => {
  const [isRateLimited, setRatelimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
        setRatelimited(false);
      } catch (error) {
        console.log("Error fetching notes:", error);
        if (error.response && error.response.status === 429) {
          setRatelimited(true);
        } else {
          toast.error("Failed to load Notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      {isRateLimited && <RateLimited />}

      <div className="max-w-7xl mx-auto content-center p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes</div>}
        {notes.length===0 && !isRateLimited && <NoteNotFound/>}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note._id}>
                <NoteCard key={note._id} note={note} setNotes = {setNotes} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
