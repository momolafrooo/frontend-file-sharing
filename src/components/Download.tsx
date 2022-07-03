import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./Upload.css";

function download(link: string, name: string) {
  var element = document.createElement("a");
  element.setAttribute("href", link);
  element.setAttribute("download", name);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function Download() {
  const { uuid, isProtected } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>("");
  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`http://localhost:9999/api/download`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uuid, password }),
    })
      .then((res) => {
        if (res.ok) return res.json();

        throw new Error(res.statusText);
      })
      .then((json) => {
        download(json.url, json.name);
        navigate("/");
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, [password, uuid, navigate]);

  useEffect(() => {
    if (!Boolean(isProtected)) {
      fetchData();
    }
  }, [fetchData, isProtected]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e?.currentTarget?.value);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      fetchData();
    },
    [fetchData]
  );

  return (
    <div className="App">
      <section className="content">
        <h2>Download File</h2>
        <form className="form" onSubmit={handleSubmit}>
          {Boolean(isProtected) && (
            <>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                onChange={handlePasswordChange}
                placeholder="Entrer password"
                id="password"
                required
              />
            </>
          )}

          {loading ? <div>...Loading</div> : <button type="submit">Download</button>}
        </form>
      </section>
    </div>
  );
}

export default Download;
