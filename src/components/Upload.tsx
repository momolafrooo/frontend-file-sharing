import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import "./Upload.css";

export interface File {
  uuid: string;
  url: string;
  name: string;
  protected: boolean;
}

function Upload() {
  const [content, setContent] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [filename, setFilename] = useState<string | null>("");
  const [uploadResponse, setUploadResponse] = useState<File | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      try {
        const result = await fetch("http://localhost:9999/api/upload", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, name: filename, password }),
        });
        const json = await result.json();
        setUploadResponse(json);
        setContent(null);
        setPassword("");
        setFilename("");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [content, password, filename]
  );

  const handleChangeFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.currentTarget?.files![0];
    setFilename(file?.name || "");

    // Encode the file using the FileReader API
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setContent(reader.result as string);
    reader.onerror = (error) => console.error(error);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e?.currentTarget?.value);
  }, []);

  return (
    <div className="App">
      <section className="content">
        <h2>File Sharing</h2>
        <form className="form" onSubmit={onSubmit}>
          <label htmlFor="file">File</label>
          <input type="file" name="file" onChange={handleChangeFile} id="file" required />

          <label htmlFor="password">Password (optional)</label>
          <input
            type="password"
            name="password"
            onChange={handlePasswordChange}
            placeholder="Entrer password"
            value={password!}
            id="password"
          />

          {Loading ? (
            <div style={{ fontSize: 18, display: "flex", justifyContent: "center" }}>...Uploading</div>
          ) : (
            <button type="submit">Upload</button>
          )}
        </form>

        {uploadResponse && (
          <h3>
            Here is link:{" "}
            <Link
              to={`/download/${uploadResponse.uuid}/${uploadResponse.protected}`}
            >{`${window.location.origin}/download/${uploadResponse.uuid}/${uploadResponse.protected}`}</Link>
          </h3>
        )}
      </section>
    </div>
  );
}

export default Upload;
