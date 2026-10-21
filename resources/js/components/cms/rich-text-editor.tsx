import React, { useState, useRef, useEffect } from 'react';
import { 
    Bold, 
    Italic, 
    Underline, 
    Strikethrough, 
    Heading2, 
    Heading3, 
    Quote, 
    List, 
    ListOrdered, 
    Link as LinkIcon, 
    Image as ImageIcon, 
    Code, 
    Minus, 
    Eye, 
    Code2, 
    Undo, 
    Redo,
    RemoveFormatting,
    FileText
} from 'lucide-react';
import { MediaLibraryModal } from './media-library-modal';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
}

export function RichTextEditor({
    value,
    onChange,
    error,
    placeholder = 'Start writing your news story here...',
}: RichTextEditorProps) {
    const [mode, setMode] = useState<'visual' | 'code' | 'preview'>('visual');
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Synchronize HTML with contenteditable when switching modes or initial load
    useEffect(() => {
        if (editorRef.current && mode === 'visual' && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value, mode]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const exec = (command: string, arg: string | undefined = undefined) => {
        if (mode !== 'visual') return;
        document.execCommand(command, false, arg);
        handleInput();
        editorRef.current?.focus();
    };

    const handleFormatBlock = (tag: string) => {
        exec('formatBlock', `<${tag}>`);
    };

    const handleInsertLink = () => {
        const url = prompt('Enter destination URL (https://...):', 'https://');
        if (url && url !== 'https://') {
            exec('createLink', url);
        }
    };

    const handleInsertImage = (media: { url: string; caption?: string; alt_text?: string }) => {
        const figureHtml = `
            <figure class="my-6">
                <img src="${media.url}" alt="${media.alt_text || ''}" class="w-full rounded-xl shadow-xs border border-slate-200" />
                ${media.caption ? `<figcaption class="text-xs text-slate-500 italic mt-2 text-center">${media.caption}</figcaption>` : ''}
            </figure>
            <p><br></p>
        `;

        if (mode === 'visual' && editorRef.current) {
            exec('insertHTML', figureHtml);
        } else {
            onChange((value || '') + '\n\n' + figureHtml);
        }
    };

    // Calculate metrics
    const textContent = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent ? textContent.split(' ').filter(Boolean).length : 0;
    const charCount = textContent.length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {/* Top Toolbar */}
            <div className="p-2 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Left: Formatting tools */}
                <div className="flex flex-wrap items-center gap-1">
                    {/* Visual Mode Tools */}
                    {mode === 'visual' && (
                        <>
                            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => exec('bold')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                                    title="Bold (Ctrl+B)"
                                >
                                    <Bold className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => exec('italic')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                                    title="Italic (Ctrl+I)"
                                >
                                    <Italic className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => exec('underline')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                                    title="Underline (Ctrl+U)"
                                >
                                    <Underline className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => exec('strikeThrough')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                                    title="Strikethrough"
                                >
                                    <Strikethrough className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => handleFormatBlock('h2')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition flex items-center gap-0.5 text-xs font-bold"
                                    title="Heading 2"
                                >
                                    <Heading2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFormatBlock('h3')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition flex items-center gap-0.5 text-xs font-bold"
                                    title="Heading 3"
                                >
                                    <Heading3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFormatBlock('p')}
                                    className="px-2 py-1 rounded hover:bg-slate-100 text-slate-700 transition text-[11px] font-semibold"
                                    title="Normal Paragraph"
                                >
                                    ¶
                                </button>
                            </div>

                            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => exec('insertUnorderedList')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                                    title="Bullet List"
                                >
                                    <List className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => exec('insertOrderedList')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                                    title="Numbered List"
                                >
                                    <ListOrdered className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFormatBlock('blockquote')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                                    title="Blockquote"
                                >
                                    <Quote className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={handleInsertLink}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                                    title="Insert Hyperlink"
                                >
                                    <LinkIcon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMediaModalOpen(true)}
                                    className="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center gap-1 text-xs font-bold"
                                    title="Insert Image from Library"
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>Image</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => exec('insertHorizontalRule')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                                    title="Horizontal Divider"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => exec('removeFormat')}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition"
                                    title="Clear Formatting"
                                >
                                    <RemoveFormatting className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </>
                    )}

                    {mode === 'code' && (
                        <button
                            type="button"
                            onClick={() => setMediaModalOpen(true)}
                            className="px-2.5 py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center gap-1.5 text-xs font-bold"
                        >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Insert Image HTML</span>
                        </button>
                    )}
                </div>

                {/* Right: Mode Toggle Buttons */}
                <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setMode('visual')}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                            mode === 'visual'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Visual</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode('code')}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                            mode === 'code'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>HTML</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode('preview')}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                            mode === 'preview'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                    </button>
                </div>
            </div>

            {/* Editor Canvas */}
            <div className="min-h-[380px] flex-1 flex flex-col bg-white">
                {/* 1. VISUAL WYSIWYG MODE */}
                {mode === 'visual' && (
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        className="flex-1 p-6 font-serif text-slate-800 text-base leading-relaxed focus:outline-none min-h-[380px] prose prose-slate max-w-none"
                        style={{ outline: 'none' }}
                        data-placeholder={placeholder}
                    />
                )}

                {/* 2. HTML SOURCE CODE MODE */}
                {mode === 'code' && (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Write or edit raw article HTML markup..."
                        className="w-full flex-1 p-6 font-mono text-xs sm:text-sm text-slate-900 bg-slate-950/5 focus:bg-white focus:outline-none border-none min-h-[380px] leading-relaxed resize-y"
                    />
                )}

                {/* 3. PUBLIC ARTICLE PREVIEW MODE */}
                {mode === 'preview' && (
                    <div className="flex-1 p-6 sm:p-8 bg-slate-50 overflow-y-auto">
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xs border border-slate-200">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-4">
                                Live Article Reader Preview
                            </span>
                            <div 
                                className="font-serif text-slate-800 text-base sm:text-lg leading-relaxed prose prose-lg prose-slate max-w-none"
                                dangerouslySetInnerHTML={{ __html: value || '<p className="text-slate-400 italic">No article content yet.</p>' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Status Bar */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0 font-mono text-[11px]">
                <div className="flex items-center gap-4">
                    <span><strong>{wordCount}</strong> words</span>
                    <span>•</span>
                    <span><strong>{charCount}</strong> chars</span>
                    <span>•</span>
                    <span>~{readingTime} min read</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="uppercase tracking-wider font-semibold text-[10px]">HTML5 Compliant</span>
                </div>
            </div>

            {error && (
                <div className="p-2 bg-rose-50 border-t border-rose-200 text-xs font-semibold text-rose-700">
                    {error}
                </div>
            )}

            {/* Media Library Modal */}
            <MediaLibraryModal
                isOpen={mediaModalOpen}
                onClose={() => setMediaModalOpen(false)}
                onSelect={handleInsertImage}
                title="Insert Media into Article Body"
            />
        </div>
    );
}
