import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Post } from '../../../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArticleFormProps } from '../../../types';
import { FormDataArticle } from '../../../types';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MDXEditor } from '@mdxeditor/editor';
import YoutubeExtractor from '../utils/youtubeExtractor';
import { Youtube, ChevronLeft, Image } from 'lucide-react';
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
  directivesPlugin,
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
import { NavLink } from 'react-router';

const InsertYouTube = ({ editorRef, onInsert }: { editorRef: React.RefObject<MDXEditorMethods | null>, onInsert: (content: string) => void }) => {
    const insertYouTube = () => {
        const url = prompt('Enter YouTube URL or Video ID:');
        if (url) {
            let videoId = url;
            
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(youtubeRegex);
            
            if (match) {
                videoId = match[1];
            }
            
            const youtubeMarkdown = `:youtube[${videoId}]`;
            
            const currentContent = editorRef.current?.getMarkdown() || '';
            const newContent = currentContent + '\n\n' + youtubeMarkdown + '\n\n';
            
            editorRef.current?.setMarkdown(newContent);
            onInsert(newContent);
        }
    };

    return (
        <Button
            type="button"
            onClick={insertYouTube}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
        >   
            <Youtube className="w-4 h-4" />
            YouTube
        </Button>
    );
};

// Componenta pentru imagine nu mai este necesară în toolbar

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
    onBack,
    mode 
}: ArticleFormProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [contentValue, setContentValue] = useState<string>(initialData?.content || '');
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const editorRef = useRef<MDXEditorMethods | null>(null);
    
    // State for tracking changes
    const [initialTitle, setInitialTitle] = useState<string>(initialData?.title || '');
    const [initialContent, setInitialContent] = useState<string>(initialData?.content || '');
    const [initialFeaturedImage, setInitialFeaturedImage] = useState<string>(initialData?.featuredImageUrl || '');

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormDataArticle >({
        resolver: yupResolver(schema),
        defaultValues: {
            title: initialData?.title || '',
            content: initialData?.content || '',
            featuredImageUrl: initialData?.featuredImageUrl || ''
        }
    });

    // Watch for changes in form fields
    const watchedTitle = watch('title');
    const watchedContent = watch('content');
    const watchedFeaturedImage = watch('featuredImageUrl');
    
    // Check if form has been modified
    const hasChanges = (watchedTitle !== initialTitle) || (watchedContent !== initialContent) || (watchedFeaturedImage !== initialFeaturedImage);

    useEffect(() => {
        if (mode === 'edit' && articleId && !initialData) {
            setLoading(true);
            fetch(`/api/articles/${articleId}`)
                .then(res => res.json())
                .then((data: Post) => {
                    console.log('Loaded article data:', data); // Debug line
                    setValue('title', data.title || '');
                    const newContent = data.content || '';
                    setValue('content', newContent);
                    setValue('featuredImageUrl', data.featuredImageUrl || '');
                    setContentValue(newContent);
                    // Set initial values for change tracking
                    setInitialTitle(data.title || '');
                    setInitialContent(newContent);
                    setInitialFeaturedImage(data.featuredImageUrl || '');
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

        // Don't submit if no changes were made
        if (mode === 'edit' && !hasChanges) {
            setError('No changes were made to save.');
            return;
        }
        
        setSaving(true);
        const token: string | null = localStorage.getItem('jwt');
        
        try {
            const url = mode === 'edit' ? `/api/articles/${articleId}` : '/api/articles';
            const method = mode === 'edit' ? 'PUT' : 'POST';
            
            const payload = { 
                title: data.title, 
                content: data.content,
                featuredImageUrl: data.featuredImageUrl || null
            };
            console.log('Submitting payload:', payload); // Debug line
            
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
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
            <div className="flex items-center text-sm text-gray-600 mb-4 mt-5">
                <NavLink to="/admin/articles" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Articles
                </NavLink>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image (Optional)
                    </label>
                    <Input 
                        type="url" 
                        placeholder="https://example.com/image.jpg" 
                        className="w-full"
                        {...register("featuredImageUrl")} 
                    />
                    {errors.featuredImageUrl && <span className="text-red-500 text-sm">{errors.featuredImageUrl.message}</span>}
                    <p className="text-xs text-gray-500 mt-1">This image will appear in article cards, not in the content</p>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <Input 
                        type="text" 
                        placeholder="Article title" 
                        className="w-full"
                        {...register("title")} 
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                </div>
                
                <div className="mb-4">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-300 mb-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab('edit')}
                            className={`px-4 py-2 font-medium ${
                                activeTab === 'edit'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                             Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-2 font-medium ${
                                activeTab === 'preview'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Preview
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'edit' ? (
                        <div className="w-full border rounded mdx-editor p-2 min-h-[420px]">
                            <MDXEditor
                                ref={editorRef}
                                markdown={contentValue}
                                onChange={(md) => {
                                    setContentValue(md);
                                    setValue('content', md, { shouldValidate: true });
                                }}
                                plugins={[
                                    directivesPlugin({
                                        directiveDescriptors: [
                                            {
                                                name: 'youtube',
                                                type: 'leafDirective',
                                                testNode: (node) => {
                                                    return node.name === 'youtube';
                                                },
                                                attributes: [],
                                                hasChildren: false,
                                                Editor: ({ mdastNode }) => {
                                                    return (
                                                        <YoutubeExtractor 
                                                            id={mdastNode.attributes?.id || mdastNode.children?.[0]?.value || ''} 
                                                        />
                                                    );
                                                }
                                            }
                                        ]
                                    }),
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
                                                <Separator />
                                                <InsertYouTube 
                                                    editorRef={editorRef} 
                                                    onInsert={(content) => {
                                                        setContentValue(content);
                                                        setValue('content', content, { shouldValidate: true });
                                                    }}
                                                />

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
                    ) : (
                        <div className="w-full border rounded p-6 min-h-[420px] bg-gray-50">
                            <div className="max-w-none [&>*]:mb-4 
                                [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-6 [&>h1]:mt-8
                                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-4 [&>h2]:mt-6
                                [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mb-3 [&>h3]:mt-5
                                [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-gray-900 [&>h4]:mb-2 [&>h4]:mt-4
                                [&>h5]:text-base [&>h5]:font-bold [&>h5]:text-gray-900 [&>h5]:mb-2 [&>h5]:mt-3
                                [&>h6]:text-sm [&>h6]:font-bold [&>h6]:text-gray-900 [&>h6]:mb-1 [&>h6]:mt-2
                                [&>p]:text-gray-700 [&>p]:leading-7 [&>p]:mb-4
                                [&>ul]:mb-4 [&>ol]:mb-4 [&>li]:mb-1
                                [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600
                                [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono
                                [&>pre]:bg-gray-800 [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded [&>pre]:overflow-x-auto [&>pre]:font-mono
                                [&>a]:text-blue-600 [&>a]:underline [&>a:hover]:text-blue-800
                                [&>strong]:font-bold [&>em]:italic
                                [&>table]:border-collapse [&>table]:w-full [&>table]:border [&>table]:border-gray-300
                                [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-gray-300 [&>table>thead>tr>th]:bg-gray-50 [&>table>thead>tr>th]:p-2 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-semibold
                                [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-300 [&>table>tbody>tr>td]:p-2">
                                {contentValue ? (
                                    <div>
                                       
                                        {contentValue.split(/(:youtube\[[^\]]+\])/).map((part, index) => {
                                            const youtubeMatch = part.match(/:youtube\[([^\]]+)\]/);
                                            if (youtubeMatch) {
                                                return <YoutubeExtractor key={index} id={youtubeMatch[1]} />;
                                            }
                                            return part ? (
                                                <ReactMarkdown 
                                                    key={index} 
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>,
                                                        h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h2>,
                                                        h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-5">{children}</h3>,
                                                        h4: ({children}) => <h4 className="text-lg font-bold text-gray-900 mb-2 mt-4">{children}</h4>,
                                                        h5: ({children}) => <h5 className="text-base font-bold text-gray-900 mb-2 mt-3">{children}</h5>,
                                                        h6: ({children}) => <h6 className="text-sm font-bold text-gray-900 mb-1 mt-2">{children}</h6>,
                                                        p: ({children}) => <p className="text-gray-700 leading-7 mb-4">{children}</p>,
                                                        code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                                                        blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
                                                        a: ({children, href}) => <a href={href} className="text-blue-600 underline hover:text-blue-800">{children}</a>,
                                                        strong: ({children}) => <strong className="font-bold">{children}</strong>,
                                                        em: ({children}) => <em className="italic">{children}</em>,
                                                        ul: ({children}) => <ul className="mb-4 list-disc pl-6">{children}</ul>,
                                                        ol: ({children}) => <ol className="mb-4 list-decimal pl-6">{children}</ol>,
                                                        li: ({children}) => <li className="mb-1">{children}</li>,
                                                        img: ({src, alt}) => <img src={src} alt={alt} className="max-w-full h-auto rounded-lg shadow-md my-4" />
                                                    }}
                                                >
                                                    {part}
                                                </ReactMarkdown>
                                            ) : null;
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">
                                        Start writing in the Edit tab to see a preview here...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <Button type="submit" disabled={saving || (mode === 'edit' && !hasChanges)} variant="greenDark" className="mr-2">
                            {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Article')}
                        </Button>
                        <Button type="button" onClick={onCancel} disabled={saving} variant="redDark" className="mr-2">
                            <NavLink to="/admin/posts">
                                Cancel
                            </NavLink>
                        </Button>
                    </div>
                    {/* {onBack && (
                        <div>
                            <Button type="button" onClick={onBack} disabled={saving} variant="beige">
                                Back
                            </Button>
                        </div>
                    )} */}
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