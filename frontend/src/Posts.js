import { useState, useEffect } from 'react';
import { NavLink } from  "react-router";

export function Posts() {
    const [articles, setArticles] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    useEffect(() => {
        fetch("/api/articles")
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                setArticles(data);
            })
            .catch((err) => console.error("Eroare la fetch:", err));
    }, []);

    const authors = Array.from(new Set(
      articles.map(a => a.author).filter(a => a && a.trim() !== "")
    )).sort((a, b) => a.localeCompare(b));
    const filteredArticles = selectedAuthor
      ? articles.filter(a => a.author === selectedAuthor)
      : articles;

   return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
      </div>
      <h2 className="author-title">All Articles</h2>
      <div className="articles">
        {filteredArticles.map((article) => (
          <div className="article" key={article.id}>
            <div className="title">{article.title}</div>

            <div className="author-line">
              Created by{' '}
              <NavLink to={`/users/${article.authorId}`} className="author">
                {article.author}
              </NavLink>
            </div>

            <div className="sum">{article.summary}</div>

            <NavLink to={`/posts/${article.id}`} className="read-it-all">
              Read it all →
            </NavLink>

            <div className="created-date">
              {new Date(article.createdDate).toLocaleDateString()}
            </div>
            
          </div>
        ))}
      </div>
      {/* <NavLink to="/create" className="create-article-btn">
        Create new article
      </NavLink> */}
    </div>
  );
}