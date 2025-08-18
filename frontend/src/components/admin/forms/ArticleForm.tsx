import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../../../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArticleFormProps } from '../../../types';
import { FormDataArticle } from '../../../types';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MDXEditor } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import {
  toolbarPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertTable,
  InsertCodeBlock,
  Separator,
  type MDXEditorMethods
} from '@mdxeditor/editor';

// Validation schema
const schema = yup
  .object({
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    content: yup.string().required('Content is required').min(10, 'Content must be at least 10 characters')
  })
  .required();

export function ArticleForm({ 
    articleId, 
    initialData, 
    onSave, 
    onCancel, 
    mode 
}: ArticleFormProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [contentValue, setContentValue] = useState<string>(initialData?.content || '');
    const editorRef = useRef<MDXEditorMethods | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormDataArticle >({
        resolver: yupResolver(schema),
        defaultValues: {
            title: initialData?.title || '',
            content: initialData?.content || ''
        }
    });

    useEffect(() => {
        if (mode === 'edit' && articleId && !initialData) {
            setLoading(true);
            fetch(`/api/articles/${articleId}`)
                .then(res => res.json())
                .then((data: Post) => {
                    setValue('title', data.title || '');
                    const newContent = data.content || '';
                    setValue('content', newContent);
                    setContentValue(newContent);
                    // Update editor content if already mounted
                    editorRef.current?.setMarkdown(newContent);
                })
                .catch(() => setError('Could not load article.'))
                .finally(() => setLoading(false));
        }
    }, [articleId, initialData, mode, setValue]);

    const onSubmit = async (data: any) => {
        setError(null);
        
        if (!data.title.trim() || !data.content.trim()) {
            setError('Title and content are required');
            return;
        }
        
        setSaving(true);
        const token: string | null = localStorage.getItem('jwt');
        
        try {
            const url = mode === 'edit' ? `/api/articles/${articleId}` : '/api/articles';
            const method = mode === 'edit' ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: data.title, content: data.content })
            });
            
            if (res.ok) {
                const savedArticle: Post = await res.json();
                onSave(savedArticle);
            } else {
                setError(`Could not ${mode} article.`);
            }
        } catch {
            setError(`Could not ${mode} article.`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading article...</div>;
    }

    return (
        <div className="p-4 max-w-5xl w-full mx-auto">
            <h2>{mode === 'edit' ? 'Edit Article' : 'Create Article'}</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="mb-4">
                    <Input 
                        type="text" 
                        placeholder="Article title" 
                        className="w-full"
                        {...register("title")} 
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                </div>
                
                <div className="mb-4">
                    <div className="w-full border rounded  mdx-editor p-2 min-h-[420px]">
                      <MDXEditor
                        ref={editorRef}
                        markdown={contentValue}
                        onChange={(md) => {
                          setContentValue(md);
                          setValue('content', md, { shouldValidate: true });
                        }}
                        plugins={[
                          toolbarPlugin({
                            toolbarContents: () => (
                              <>
                                <UndoRedo />
                                <Separator />
                                <BoldItalicUnderlineToggles />
                                <CodeToggle />
                                <Separator />
                                <BlockTypeSelect />
                                <ListsToggle />
                                <Separator />
                                <CreateLink />
                                <InsertTable />
                                <InsertCodeBlock />
                              </>
                            )
                          }),
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                          markdownShortcutPlugin(),
                          linkPlugin(),

                          tablePlugin(),
                          codeBlockPlugin({
                            defaultCodeBlockLanguage: 'plaintext'
                          }),
                          codeMirrorPlugin({
                            codeBlockLanguages: {
                              plaintext: 'Plain text',
                              js: 'JavaScript',
                              ts: 'TypeScript',
                              json: 'JSON',
                              java: 'Java',
                              md: 'Markdown'
                            }
                          })
                        ]}
                      />
                    </div>
                    {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
                </div>
                
                <div className="mt-4">
                        <Button type="submit" disabled={saving } variant="greenDark" className="mr-2">
                        {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Article')}
                    </Button>
                    <Button type="button" onClick={onCancel} disabled={saving} variant="redDark" className="mr-2">
                        Cancel
                    </Button>
                </div>
                
                {error && (
                    <div className="text-red-500 mt-2">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}