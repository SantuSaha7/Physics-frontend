"use client";
import { useEffect, useState } from "react";

export default function AddPdf() {
  const [chapters, setChapters] = useState([]);
  const [chapterId, setChapterId] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chapters/class/CLASS_ID_HERE`
    )
      .then(r => r.json())
      .then(setChapters);
  }, []);

  const submit = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/pdfs/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          drive_link: link,
          chapter_id: chapterId,
        }),
      }
    );
    alert("PDF added");
  };

  return (
    <div>
      <select onChange={e => setChapterId(e.target.value)}>
        <option>Select Chapter</option>
        {chapters.map(c => (
          <option key={c._id} value={c._id}>{c.title}</option>
        ))}
      </select>

      <input placeholder="PDF Title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Google Drive Link" onChange={e => setLink(e.target.value)} />
      <button onClick={submit}>Add PDF</button>
    </div>
  );
}
