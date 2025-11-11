// filepath: /home/zarif/Project/taxmin/front-end/src/pages/admin/learning/UpdateSubchapter.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import subchapterService from "../../../services/subchapterService";
import chapterService from "../../../services/chapterService";

const UpdateSubchapter = () => {
  const { chapterId, subchapterId } = useParams();
  const navigate = useNavigate();
  
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    resume: "",
    orderIndex: 1
  });

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextStyle,
      Color,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const chapterResponse = await chapterService.getChapterById(chapterId);
        if (chapterResponse.status === 'success') {
          setChapter(chapterResponse.data);
        }

        const subchapterResponse = await subchapterService.getSubchapterById(subchapterId);
        if (subchapterResponse.status === 'success') {
          const data = subchapterResponse.data;
          setFormData({
            title: data.title,
            content: data.content || "",
            resume: data.resume || "",
            orderIndex: data.orderIndex
          });
          editor?.commands.setContent(data.content || '');
        }
      } catch (error) {
        showNotification("error", error.message || "Gagal memuat data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [chapterId, subchapterId, editor]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await subchapterService.updateSubchapter(subchapterId, formData);
      
      if (response.status === 'success') {
        showNotification("success", "Subchapter berhasil diupdate!");
        setTimeout(() => {
          navigate(`/admin/subchapters/${chapterId}`);
        }, 1500);
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal mengupdate subchapter!");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 animate-slide-in-right ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}>
          {notification.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/admin/subchapters/${chapterId}`)}
          className="p-2 hover:bg-neutral-light rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-primary">Edit Subchapter</h1>
          <p className="text-secondary mt-1">Update subchapter yang sudah ada</p>
        </div>
      </div>

      {/* Chapter Info */}
      {chapter && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Chapter:</strong> {chapter.title}
          </p>
          {chapter.book && (
            <p className="text-sm text-blue-700 mt-1">
              <strong>Book:</strong> {chapter.book.title}
            </p>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Judul Subchapter <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            placeholder="Contoh: 1.1 Definisi Pajak"
            required
            maxLength={255}
          />
        </div>

        {/* Order Index */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Urutan <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            required
            min="1"
          />
          <p className="text-xs text-secondary mt-1">
            Urutan bisa diubah dengan drag & drop setelah subchapter disimpan
          </p>
        </div>

        {/* Resume */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Resume/Ringkasan
          </label>
          <textarea
            name="resume"
            value={formData.resume}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            placeholder="Ringkasan singkat dari subchapter ini..."
          />
        </div>

        {/* TipTap Editor */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Konten Subchapter
          </label>
          
          {/* Toolbar */}
          <div className="border-2 border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 font-bold ${editor?.isActive('bold') ? 'bg-gray-300' : ''}`}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 italic ${editor?.isActive('italic') ? 'bg-gray-300' : ''}`}
            >
              I
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 line-through ${editor?.isActive('strike') ? 'bg-gray-300' : ''}`}
            >
              S
            </button>
            <div className="w-px bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${editor?.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${editor?.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
            >
              H3
            </button>
            <div className="w-px bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${editor?.isActive('bulletList') ? 'bg-gray-300' : ''}`}
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${editor?.isActive('orderedList') ? 'bg-gray-300' : ''}`}
            >
              1. List
            </button>
            <div className="w-px bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
            >
              ⇤
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
            >
              ⇔
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
            >
              ⇥
            </button>
          </div>

          {/* Editor Content */}
          <div className="border-2 border-t-0 border-gray-300 rounded-b-lg">
            <EditorContent 
              editor={editor} 
              className="prose max-w-none p-4 min-h-[400px]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/admin/subchapters/${chapterId}`)}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {loading ? 'Menyimpan...' : 'Update Subchapter'}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        /* TipTap Editor Styles */
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.75rem 0;
        }
        
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        
        /* List Styles - FIXED */
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .ProseMirror ul ul {
          list-style-type: circle;
        }
        
        .ProseMirror ul ul ul {
          list-style-type: square;
        }
        
        .ProseMirror li {
          margin: 0.25rem 0;
          display: list-item;
        }
        
        .ProseMirror li p {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default UpdateSubchapter;