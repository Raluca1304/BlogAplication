import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from "react-router";

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdDate: string;
}

interface Comment {
  id: string;
  text: string;
  authorName?: string;
}

export function PostItem(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState<boolean>(true);
    const [newComment, setNewComment] = useState<string>("");
    const [error, setError] = useState<string | JSX.Element | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
      if (!id) return;

      fetch(`/api/articles/${id}`)
        .then((res) => res.json())
        .then((data: Article) => setArticle(data))
        .catch((err) => console.error("Eroare la fetch:", err));

      setLoadingComments(true);
      const token: string | null = localStorage.getItem("jwt");
      fetch(`/api/articles/${id}/comments`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((data: Comment[] | any) => setComments(Array.isArray(data) ? data : []))
        .catch(err => setComments([]))
        .finally(() => setLoadingComments(false));
    }, [id]);

    const handleAddComment = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setError(null);
      setSuccess(null);
      const token: string | null = localStorage.getItem("jwt");
      
      if (!token) {
        setError(
          <span>
            You need to be logged in to add a comment!<br/>
            <button className="login-btn" onClick={() => window.location.href = '/login'}>You have an account? Login</button>
            <button className="register-btn" onClick={() => window.location.href = '/login'} style={{marginLeft: 8}}>You don't have an account? Register</button>
          </span>
        );
        return;
      }
      
      try {
        const res = await fetch(`/api/articles/${id}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ text: newComment })
        });
        const text = await res.json();
        if (res.ok) {
          setSuccess("Comment added!");
          setNewComment("");
          fetch(`/api/articles/${id}/comments`)
            .then(res => res.json())
            .then((data: Comment[]) => setComments(data));
            
        } else {
          setError("Could not add comment.");
        }
      } catch (err) {
        setError("Could not add comment.");
      }
    };

    const handleDeleteComment = async (commentId: string): Promise<void> => {
      const token: string | null = localStorage.getItem("jwt");
      if (!window.confirm("Are you sure you want to delete this comment?")) return;
      
      try {
        const res = await fetch(`/api/articles/${id}/comments/${commentId}`, {
          method: "DELETE",
          headers: {'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setComments(comments.filter(c => c.id !== commentId));
        } else {
          alert("You are not allowed to delete this comment!");
        }
      } catch (err) {
        alert("Error deleting comment!");
      }
      
      if(!token) {
        setError(
          <span>
            You need to be logged in to delete a comment as an basic user!<br/>
          </span>
        );
      }
    };

    const currentUser: string | null = localStorage.getItem("username");

    console.log("article:", article, "currentUser:", currentUser);

    if (!article || !article.title) {
      return <p>Loading...</p>;
    }
    
    return (
      <div className="article">
        <h2>{article.title}</h2>
        <p>{article.content}</p>
        <p>
          <small>{new Date(article.createdDate).toLocaleString()}</small>
        </p>
        {currentUser === article.author && (
          <NavLink to={`/posts/${id}/edit`} className="edit-btn">Edit</NavLink>
        )}

        <div className="comments-section">
          <h3>Comments</h3>
          {loadingComments ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id} style={{marginBottom: '12px'}}>
                  <strong>{comment.authorName || 'Anonymous'}:</strong> {comment.text}
                  {article.author === currentUser && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleAddComment}>
            {error && <div className="error-msg" style={{color: 'red', fontWeight: 'bold', marginBottom: 8}}>{error}</div>}
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              
            />
            <button className="submit-btn">Add Comment</button>
            {success && <p className="success-msg">{success}</p>}
          </form>
        </div>
      </div>
    );
  } 