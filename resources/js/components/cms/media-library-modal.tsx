import React, { useState, useEffect, useRef } from 'react';
import { 
    X, 
    UploadCloud, 
    Image as ImageIcon, 
    Check, 
    Search, 
    Trash2, 
    Sparkles, 
    FileCheck, 
    Loader2, 
    Maximize2,
    RefreshCw
} from 'lucide-react';
import { MediaItem } from '@/types/news';
import { toast } from 'sonner';

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: { url: string; caption?: string; alt_text?: string }) => void;
    title?: string;
}

export function MediaLibraryModal({
    isOpen,
    onClose,
    onSelect,
    title = 'Editorial Media Library & Image Optimizer',
}: MediaLibraryModalProps) {
    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
    const [library, setLibrary] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

    // Upload state
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedItem, setUploadedItem] = useState<MediaItem | null>(null);
    const [altText, setAltText] = useState('');
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchLibrary();
        }
    }, [isOpen]);

    const fetchLibrary = async (searchQuery = '') => {
        setLoading(true);
        try {
            const url = searchQuery 
                ? `/cms/media?search=${encodeURIComponent(searchQuery)}` 
                : '/cms/media';
            const res = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (res.ok) {
                const data = await res.json();
                setLibrary(data.data || []);
                if (data.data?.length > 0 && !selectedItem) {
                    setSelectedItem(data.data[0]);
                }
            }
        } catch (err) {
            console.error('Failed to load media library', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchLibrary(search);
    };

    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (JPEG, PNG, WebP, GIF)');
            return;
        }

        setUploading(true);
        setUploadedItem(null);

        const formData = new FormData();
        formData.append('image', file);
        if (altText) formData.append('alt_text', altText);
        if (caption) formData.append('caption', caption);

        // Get CSRF token
        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

        try {
            const res = await fetch('/cms/media/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                const newMedia: MediaItem = data.media;
                setUploadedItem(newMedia);
                setSelectedItem(newMedia);
                toast.success(
                    `Optimized! Saved ${newMedia.savings_percentage ?? 0}% (${newMedia.formatted_original_size ?? ''} → ${newMedia.formatted_optimized_size ?? ''})`
                );
                // Refresh library list
                fetchLibrary();
            } else {
                const errData = await res.json();
                toast.error(errData.message || 'Image upload failed');
            }
        } catch (err) {
            toast.error('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this media file?')) return;

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
        try {
            const res = await fetch(`/cms/media/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (res.ok) {
                toast.success('Media removed');
                setLibrary(prev => prev.filter(item => item.id !== id));
                if (selectedItem?.id === id) {
                    setSelectedItem(null);
                }
            }
        } catch {
            toast.error('Failed to delete media');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 leading-tight">
                                {title}
                            </h2>
                            <p className="text-xs text-slate-500">
                                Automatic WebP conversion & compression (reduces payload by 70–85%)
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab('library')}
                            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition ${
                                activeTab === 'library'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <ImageIcon className="w-4 h-4" />
                            <span>Media Library ({library.length})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('upload')}
                            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition ${
                                activeTab === 'upload'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload & Optimize</span>
                        </button>
                    </div>

                    {activeTab === 'library' && (
                        <form onSubmit={handleSearchSubmit} className="relative pb-2">
                            <input
                                type="text"
                                placeholder="Search library..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none w-48 sm:w-64"
                            />
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </form>
                    )}
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* TAB 1: LIBRARY BROWSER */}
                    {activeTab === 'library' && (
                        <div className="flex-1 flex overflow-hidden">
                            {/* Grid View */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                {loading ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                        <span className="text-xs">Loading media assets...</span>
                                    </div>
                                ) : library.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800">No media uploaded yet</h3>
                                        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                                            Upload high-resolution editorial photos. They will be automatically converted to lightweight WebP.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('upload')}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                                        >
                                            Upload First Photo
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {library.map((item) => {
                                            const isSelected = selectedItem?.id === item.id;
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => setSelectedItem(item)}
                                                    className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition aspect-video bg-slate-100 ${
                                                        isSelected
                                                            ? 'border-blue-600 ring-2 ring-blue-500/20'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <img
                                                        src={item.url}
                                                        alt={item.alt_text || item.original_name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                                        loading="lazy"
                                                    />

                                                    {/* Badge */}
                                                    <div className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded">
                                                        {item.formatted_optimized_size || 'WebP'}
                                                    </div>

                                                    {isSelected && (
                                                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xs">
                                                            <Check className="w-3 h-3 stroke-[3]" />
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-slate-950/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition">
                                                        <p className="text-[10px] truncate font-medium">
                                                            {item.original_name}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Details Sidebar */}
                            {selectedItem && (
                                <div className="w-80 border-l border-slate-200 bg-slate-50/70 p-5 overflow-y-auto flex flex-col justify-between shrink-0 space-y-4">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-200">
                                            Asset Details
                                        </h3>

                                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white aspect-video">
                                            <img
                                                src={selectedItem.url}
                                                alt={selectedItem.alt_text || ''}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Filename:</span>
                                                <span className="font-mono text-slate-800 truncate max-w-[150px]" title={selectedItem.original_name}>
                                                    {selectedItem.original_name}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Format:</span>
                                                <span className="font-mono text-slate-800 uppercase font-semibold">
                                                    {selectedItem.mime_type.split('/')[1] || 'WebP'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Dimensions:</span>
                                                <span className="font-mono text-slate-800">
                                                    {selectedItem.width && selectedItem.height 
                                                        ? `${selectedItem.width} × ${selectedItem.height}` 
                                                        : 'Responsive'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Optimized Size:</span>
                                                <span className="font-mono text-emerald-600 font-bold">
                                                    {selectedItem.formatted_optimized_size}
                                                </span>
                                            </div>

                                            {selectedItem.savings_percentage ? (
                                                <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                                                    <span className="text-slate-500">Size Reduction:</span>
                                                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Sparkles className="w-2.5 h-2.5" />
                                                        -{selectedItem.savings_percentage}% smaller
                                                    </span>
                                                </div>
                                            ) : null}

                                            {selectedItem.caption && (
                                                <div className="py-1">
                                                    <span className="text-slate-500 block mb-0.5">Caption:</span>
                                                    <span className="text-slate-700 italic">{selectedItem.caption}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onSelect({
                                                    url: selectedItem.url,
                                                    caption: selectedItem.caption || '',
                                                    alt_text: selectedItem.alt_text || selectedItem.original_name,
                                                });
                                                onClose();
                                            }}
                                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Select This Image</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(selectedItem.id)}
                                            className="w-full py-2 px-4 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Delete from Library</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: UPLOAD & OPTIMIZE */}
                    {activeTab === 'upload' && (
                        <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center max-w-2xl mx-auto space-y-6">
                            {/* Drag & drop box */}
                            <div
                                onDragEnter={() => setDragActive(true)}
                                onDragLeave={() => setDragActive(false)}
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                                    dragActive 
                                        ? 'border-blue-600 bg-blue-50/50' 
                                        : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleFileUpload(e.target.files[0]);
                                        }
                                    }}
                                />

                                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    ) : (
                                        <UploadCloud className="w-8 h-8" />
                                    )}
                                </div>

                                <h3 className="text-sm font-bold text-slate-800">
                                    {uploading ? 'Optimizing & Compressing...' : 'Drag & drop image here, or click to browse'}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-md">
                                    Supports JPEG, PNG, WebP, GIF, AVIF up to 15MB. All images are automatically compressed to lightweight WebP.
                                </p>
                            </div>

                            {/* Optimization Result Card */}
                            {uploadedItem && (
                                <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between animate-in fade-in">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-200 border border-emerald-300">
                                            <img src={uploadedItem.url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-emerald-950">
                                                    {uploadedItem.original_name}
                                                </span>
                                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                    -{uploadedItem.savings_percentage}%
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                                                {uploadedItem.formatted_original_size} → {uploadedItem.formatted_optimized_size} WebP
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSelect({
                                                url: uploadedItem.url,
                                                caption: uploadedItem.caption || caption,
                                                alt_text: uploadedItem.alt_text || altText,
                                            });
                                            onClose();
                                        }}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Use Image</span>
                                    </button>
                                </div>
                            )}

                            {/* Alt & Caption metadata inputs */}
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Photo Caption & Attribution
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Photo: Reuters / Marcus Vance"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Accessibility Alt Text
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Delegates gathered at the Geneva summit"
                                        value={altText}
                                        onChange={(e) => setAltText(e.target.value)}
                                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
