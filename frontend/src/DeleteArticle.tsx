import React, { JSX } from "react";

interface DeleteArticleProps {
  articleId: string;
  onDelete: (articleId: string) => void;
}

export function DeleteArticle({ articleId, onDelete }: DeleteArticleProps): JSX.Element {
  const handleDelete = async (): Promise<void> => {
    const token: string | null = localStorage.getItem("jwt");
    if (!window.confirm("Sigur vrei să ștergi acest articol?")) return;
    
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        onDelete(articleId); // notifică părintele să scoată articolul din listă
      } else {
        alert("Nu ai voie să ștergi acest articol!");
      }
    } catch (err) {
      alert("Eroare la ștergere!");
    }
  };

  return (
    <button className="delete-btn" onClick={handleDelete}>
      Delete
    </button>
  );
} 