import React from "react";
import { useParams, useNavigate } from 'react-router';
import { ArticleForm } from "../../..";
import type { Post } from "../../../../types";
import { Button } from "@/components/ui/button";

export function EditArticle(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSave = (article: Post) => {
    navigate(`/admin/articles/${article.id}`);
  };

  const handleCancel = () => {
    navigate('/admin/articles');
  };

  if (!id) {
    return (
      <div className="p-4">
        <h2>Error</h2>
        <p>Article ID is required</p>
        <Button onClick={handleCancel} variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <ArticleForm 
      articleId={id}
      mode="edit"
      onSave={(article) => handleSave(article as Post)}
      onCancel={handleCancel}
      onBack={handleCancel}
    />
  );
} 