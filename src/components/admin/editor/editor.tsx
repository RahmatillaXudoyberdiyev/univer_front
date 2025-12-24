'use client'
import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    CodeToggle,
    CreateLink,
    frontmatterPlugin,
    headingsPlugin,
    imagePlugin,
    InsertTable,
    InsertThematicBreak,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    MDXEditorMethods,
    quotePlugin,
    Separator,
    StrikeThroughSupSubToggles,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import {
    BookOpen,
    Calculator,
    FileText,
    ImagePlus,
    Maximize2,
    Minimize2,
    Save,
    Search,
    Type,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const AdminEditor = () => {
    const editorRef = useRef<MDXEditorMethods>(null)
    const fileInputRef = useRef(null)
    const [markdown, setMarkdown] = useState('## Admin panelga xush kelibsiz')
    const [previewMode, setPreviewMode] = useState(false)
    const [zoom, setZoom] = useState(100)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [wordCount, setWordCount] = useState(0)
    const [charCount, setCharCount] = useState(0)
    const [readingTime, setReadingTime] = useState(0)
    const [showStats, setShowStats] = useState(true)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [autoSaveStatus, setAutoSaveStatus] = useState('saved')
    const [showImageUpload, setShowImageUpload] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const commonPlugins = [
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        tablePlugin(),
        linkPlugin(),
        linkDialogPlugin({ linkAutocompleteSuggestions: [] }),
        imagePlugin({ disableImageResize: false }),
        frontmatterPlugin(),
        markdownShortcutPlugin(),
    ]

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkDarkMode()

        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const words = markdown
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length
        const chars = markdown.length
        const reading = Math.ceil(words / 200)

        setWordCount(words)
        setCharCount(chars)
        setReadingTime(reading)
    }, [markdown])

    useEffect(() => {
        setAutoSaveStatus('saving')
        const timer = setTimeout(() => {
            setAutoSaveStatus('saved')
        }, 1000)

        return () => clearTimeout(timer)
    }, [markdown])

    const handleSave = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `document-${Date.now()}.md`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setMarkdown(e.target?.result as string || '' )
            }
            reader.readAsText(file)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const imageUrl = e.target?.result
                const imageMarkdown = `![${file.name}](${imageUrl})`
                editorRef.current?.insertMarkdown(imageMarkdown)
                setShowImageUpload(false)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    const imageUrl = e.target?.result
                    const imageMarkdown = `![${file.name}](${imageUrl})`
                    editorRef.current?.insertMarkdown(imageMarkdown)
                    setShowImageUpload(false)
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200))
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50))
    const toggleFullscreen = () => setIsFullscreen((prev) => !prev)

    const handleSearch = () => {
        if (!searchQuery) return
        alert(`Searching for: ${searchQuery}`)
    }

    const CustomImageButton = () => (
        <button
            onClick={() => setShowImageUpload(true)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded transition-all ${
                isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Upload Image"
        >
            <ImagePlus size={18} />
            <span className="text-sm hidden sm:inline">Image</span>
        </button>
    )

    const editorClassName = isDarkMode ? 'dark-theme dark-editor' : ''

    return (
        <div
            className={`container-cs min-h-screen mt-10 p-5 ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            } transition-colors duration-200`}
        >
            <div
                className={`${isFullscreen ? 'fixed inset-0 z-50' : ''} ${
                    isDarkMode ? 'bg-gray-900' : 'bg-white'
                } transition-all duration-300`}
            >
                <div
                    className={`${
                        isDarkMode
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                    } border-b sticky top-0 z-40 transition-colors duration-200`}
                >
                    <div className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <FileText
                                    className={`${
                                        isDarkMode
                                            ? 'text-blue-400'
                                            : 'text-blue-600'
                                    } transition-colors`}
                                    size={24}
                                />
                                <h1
                                    className={`text-lg sm:text-xl font-bold ${
                                        isDarkMode
                                            ? 'text-white'
                                            : 'text-gray-900'
                                    } transition-colors`}
                                >
                                    Content Editor
                                </h1>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <div
                                    className={`text-xs sm:text-sm ${
                                        isDarkMode
                                            ? 'text-gray-400'
                                            : 'text-gray-600'
                                    } flex items-center gap-1 transition-colors`}
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            autoSaveStatus === 'saved'
                                                ? 'bg-green-500'
                                                : 'bg-yellow-500'
                                        }`}
                                    ></div>
                                    {autoSaveStatus === 'saved'
                                        ? 'Saved'
                                        : 'Saving...'}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={handleZoomOut}
                                        className={`p-1.5 sm:p-2 rounded ${
                                            isDarkMode
                                                ? 'hover:bg-gray-700 text-gray-300'
                                                : 'hover:bg-gray-100 text-gray-700'
                                        } transition-all`}
                                        title="Zoom out"
                                    >
                                        <ZoomOut size={18} />
                                    </button>
                                    <span
                                        className={`text-xs sm:text-sm min-w-12 text-center ${
                                            isDarkMode
                                                ? 'text-gray-300'
                                                : 'text-gray-700'
                                        } transition-colors`}
                                    >
                                        {zoom}%
                                    </span>
                                    <button
                                        onClick={handleZoomIn}
                                        className={`p-1.5 sm:p-2 rounded ${
                                            isDarkMode
                                                ? 'hover:bg-gray-700 text-gray-300'
                                                : 'hover:bg-gray-100 text-gray-700'
                                        } transition-all`}
                                        title="Zoom in"
                                    >
                                        <ZoomIn size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className={`p-1.5 sm:p-2 rounded ${
                                        isDarkMode
                                            ? 'hover:bg-gray-700 text-gray-300'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    } transition-all`}
                                    title="Search"
                                >
                                    <Search size={18} />
                                </button>

                                <button
                                    onClick={toggleFullscreen}
                                    className={`p-1.5 sm:p-2 rounded ${
                                        isDarkMode
                                            ? 'hover:bg-gray-700 text-gray-300'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    } transition-all`}
                                    title="Toggle fullscreen"
                                >
                                    {isFullscreen ? (
                                        <Minimize2 size={18} />
                                    ) : (
                                        <Maximize2 size={18} />
                                    )}
                                </button>
                                <label
                                    className={`p-1.5 sm:p-2 rounded ${
                                        isDarkMode
                                            ? 'hover:bg-gray-700 text-gray-300'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    } cursor-pointer transition-all`}
                                    title="Import file"
                                ></label>
                                <button
                                    onClick={handleSave}
                                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 ${
                                        isDarkMode
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white rounded font-medium transition-all text-sm sm:text-base`}
                                >
                                    <Save size={18} />
                                    <span className="hidden sm:inline">
                                        Save
                                    </span>
                                </button>
                            </div>
                        </div>
                        {showSearch && (
                            <div className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search in document..."
                                    className={`flex-1 px-3 py-2 rounded border ${
                                        isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm`}
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && handleSearch()
                                    }
                                />
                                <button
                                    onClick={handleSearch}
                                    className={`px-4 py-2 ${
                                        isDarkMode
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                    } rounded transition-all text-sm`}
                                >
                                    Find
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showStats && (
                    <div
                        className={`${
                            isDarkMode
                                ? 'bg-gray-800 border-gray-700 text-gray-300'
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                        } border-b px-4 py-2 transition-colors duration-200`}
                    >
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                                <Calculator size={16} />
                                <span className="font-medium">
                                    {wordCount}
                                </span>{' '}
                                words
                            </div>
                            <div className="flex items-center gap-2">
                                <Type size={16} />
                                <span className="font-medium">
                                    {charCount}
                                </span>{' '}
                                characters
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen size={16} />
                                <span className="font-medium">
                                    {readingTime}
                                </span>{' '}
                                min read
                            </div>
                            <button
                                onClick={() => setShowStats(false)}
                                className={`ml-auto text-xs ${
                                    isDarkMode
                                        ? 'text-gray-400 hover:text-gray-300'
                                        : 'text-gray-500 hover:text-gray-700'
                                } transition-colors`}
                            >
                                Hide stats
                            </button>
                        </div>
                    </div>
                )}
                {!showStats && (
                    <button
                        onClick={() => setShowStats(true)}
                        className={`absolute top-20 right-4 p-2 ${
                            isDarkMode
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                : 'bg-white hover:bg-gray-50 text-gray-700'
                        } rounded shadow-lg transition-all z-30 text-xs`}
                    >
                        Show stats
                    </button>
                )}

                {/* Image Upload Modal */}
                {showImageUpload && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div
                            className={`${
                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                            } rounded-lg shadow-xl max-w-md w-full p-6`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3
                                    className={`text-lg font-semibold ${
                                        isDarkMode
                                            ? 'text-white'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    Upload Image
                                </h3>
                                <button
                                    onClick={() => setShowImageUpload(false)}
                                    className={`p-1 rounded ${
                                        isDarkMode
                                            ? 'hover:bg-gray-700 text-gray-400'
                                            : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                                    dragActive
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : isDarkMode
                                        ? 'border-gray-600 bg-gray-700'
                                        : 'border-gray-300 bg-gray-50'
                                } transition-all`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <ImagePlus
                                    size={48}
                                    className={`mx-auto mb-4 ${
                                        isDarkMode
                                            ? 'text-gray-400'
                                            : 'text-gray-400'
                                    }`}
                                />
                                <p
                                    className={`mb-2 ${
                                        isDarkMode
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    Drag and drop your image here
                                </p>
                                <p
                                    className={`text-sm mb-4 ${
                                        isDarkMode
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    or
                                </p>
                                <label
                                    className={`inline-block px-4 py-2 ${
                                        isDarkMode
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white rounded cursor-pointer transition-all`}
                                >
                                    Browse Files
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Editor container */}
                <div
                    className={`${
                        isFullscreen
                            ? 'h-[calc(100vh-8rem)]'
                            : 'h-[calc(100vh-12rem)]'
                    } overflow-auto transition-all duration-300`}
                    style={{ fontSize: `${zoom}%` }}
                >
                    <div className="max-w-5xl mx-auto px-4 py-6">
                        {previewMode ? (
                            <div className="prose prose-lg max-w-none transition-colors duration-200">
                                <MDXEditor
                                    markdown={markdown}
                                    plugins={commonPlugins}
                                    readOnly
                                    contentEditableClassName={`prose ${
                                        isDarkMode ? 'prose-invert' : ''
                                    }`}
                                />
                            </div>
                        ) : (
                            <MDXEditor
                                ref={editorRef}
                                markdown={markdown}
                                onChange={setMarkdown}
                                className={editorClassName}
                                plugins={[
                                    ...commonPlugins,
                                    toolbarPlugin({
                                        toolbarContents: () => (
                                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-2">
                                                <UndoRedo />
                                                <Separator />
                                                <BoldItalicUnderlineToggles />
                                                <Separator />
                                                <StrikeThroughSupSubToggles />
                                                <Separator />
                                                <CodeToggle />
                                                <Separator />
                                                <BlockTypeSelect />
                                                <Separator />
                                                <CreateLink />
                                                <CustomImageButton />
                                                <Separator />
                                                <ListsToggle />
                                                <Separator />
                                                <InsertTable />
                                                <InsertThematicBreak />
                                            </div>
                                        ),
                                    }),
                                ]}
                                contentEditableClassName="prose min-h-[600px]"
                            />
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                /* Heading sizes visible in editor */
                .mdxeditor h1 {
                    font-size: 2em !important;
                    margin: 0.8em 0 0.4em !important;
                    font-weight: bold !important;
                }
                .mdxeditor h2 {
                    font-size: 1.5em !important;
                    margin: 0.7em 0 0.4em !important;
                    font-weight: bold !important;
                }
                .mdxeditor h3 {
                    font-size: 1.3em !important;
                    margin: 0.6em 0 0.4em !important;
                    font-weight: bold !important;
                }
                .mdxeditor h4 {
                    font-size: 1.1em !important;
                    margin: 0.5em 0 0.3em !important;
                    font-weight: bold !important;
                }
                .mdxeditor h5 {
                    font-size: 1em !important;
                    margin: 0.5em 0 0.3em !important;
                    font-weight: bold !important;
                }
                .mdxeditor h6 {
                    font-size: 0.9em !important;
                    margin: 0.4em 0 0.3em !important;
                    font-weight: bold !important;
                }

                /* List markers visibility */
                .mdxeditor ul li::before {
                    color: inherit !important;
                }
                .mdxeditor ol li::marker {
                    color: inherit !important;
                }

                /* Ensure text is visible in dark mode */
                .dark-theme .mdxeditor [contenteditable='true'],
                .dark-theme .mdxeditor p,
                .dark-theme .mdxeditor h1,
                .dark-theme .mdxeditor h2,
                .dark-theme .mdxeditor h3,
                .dark-theme .mdxeditor h4,
                .dark-theme .mdxeditor h5,
                .dark-theme .mdxeditor h6,
                .dark-theme .mdxeditor li {
                    color: #f3f4f6 !important;
                }

                /* Toolbar select dropdown fixes (if needed) */
                .dark-theme select {
                    background-color: #374151 !important;
                    color: #f3f4f6 !important;
                }
                .dark-theme select option {
                    background-color: #1f2937 !important;
                    color: #f3f4f6 !important;
                }
            `}</style>
        </div>
    )
}

export default AdminEditor
