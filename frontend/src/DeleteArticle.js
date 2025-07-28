import React from "react";

export function DeleteArticle({ articleId, onDelete }) {
  const handleDelete = async () => {
    const token = localStorage.getItem("jwt");
    if (!window.confirm("Sigur vrei să ștergi acest articol?")) return;
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {// notifică părintele să scoată articolul din listă
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
