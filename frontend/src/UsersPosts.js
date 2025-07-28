import { useState, useEffect } from 'react';
import { NavLink, useParams } from "react-router";

export function UsersPosts() {
    const { id } = useParams();
    const [articles, setArticles] = useState([]);
    const [userAuthor, setUserAuthor] = useState("");
    const [selectedAuthor, setSelectedAuthor] = useState(null);
  
    useEffect(() => {
        const token = localStorage.getItem("jwt");
  
        fetch(`/api/articles?authorId=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setArticles(data))
        .catch(err => console.error("Eroare la fetch: ", err));
  
        fetch(`/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(user => {
          if (user && user.firstName && user.lastName) {
            setUserAuthor(user.lastName);
          } else {
            setUserAuthor("Autor necunoscut");
          }
        })
        .catch(err => console.error("Eroare la fetch user: ", err));
    }, [id]);
  
    const filteredArticles = selectedAuthor
      ? articles.filter(a => a.author === selectedAuthor)
      : articles;
  
    const currentUser = localStorage.getItem("username");

    const handleDelete = async (articleId) => {
      const token = localStorage.getItem("jwt");
      if (!window.confirm("Sigur vrei să ștergi acest articol?")) return;
      try {
        const res = await fetch(`/api/articles/${articleId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setArticles(articles.filter(a => a.id !== articleId));
        } else {
          alert("Nu ai voie să ștergi acest articol!");
        }
      } catch (err) {
        alert("Eroare la ștergere!");
      }
    };
  
    return (
        <div>
            <h2 className="author-title">{userAuthor}'s articles</h2>
            <div className="articles">
                {Array.isArray(filteredArticles) && filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <div className="article" key={article.id}>
                      <div className="title">{article.title}</div>
                      <div className="author-line">
                        Created by <span className="author">{article.author}</span>
                      </div>
                      <div className="sum">{article.summary}</div>
                      <NavLink to={`/posts/${article.id}`} className="read-it-all">
                        Read it all →
                      </NavLink>
                      {/* Butonul de ștergere */}
                      {article.author === currentUser && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(article.id)}
                        >
                          Delete
                        </button>
                      )}
                      <div className="created-date">
                        {new Date(article.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Nu există articole pentru acest autor.</p>
                )}
            </div>
        </div>
    );
  }