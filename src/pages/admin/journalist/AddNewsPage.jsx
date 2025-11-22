import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Node } from '@tiptap/core';
import newsService from "../../../services/newsService";

// Custom Iframe Extension untuk mendukung video embed
const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [{
      tag: 'iframe',
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'video-wrapper' }, ['iframe', HTMLAttributes]];
  },

  addCommands() {
    return {
      setIframe: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});

const AddNewsPage = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  
  // Modal states for image/video
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  // Tags input
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState({
    artikelId: "",
    title: "",
    content: "",
    fullContent: "",
    kategori: "",
    subKategori: "",
    image: "",
    tags: []
  });

  // Kategori dan Sub-kategori mapping
  const kategoriOptions = ["Perpajakan", "Ekonomi", "Perspective"];
  
  const subKategoriMapping = {
    "Perpajakan": ["KUP", "PPh", "PPN", "Coretax", "Kepabeanan & Cukai", "Lainnya"],
    "Ekonomi": ["Bisnis dan Investasi", "Nasional", "Internasional", "Lainnya"],
    "Perspective": ["Ekonomi", "Bisnis dan Investasi", "PPh", "PPN", "KUP", "Coretax", "Kepabeanan & Cukai"]
  };

  // Get available sub-kategori based on selected kategori
  const availableSubKategori = formData.kategori ? subKategoriMapping[formData.kategori] || [] : [];

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
      Iframe,
      TextStyle,
      Color,
    ],
    content: formData.fullContent,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, fullContent: editor.getHTML() }));
    },
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset subKategori when kategori changes
    if (name === 'kategori') {
      setFormData({ ...formData, [name]: value, subKategori: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (actionType) => {
    // Validate required fields
    if (!formData.artikelId || !formData.title) {
      showNotification("error", "Artikel ID dan Judul wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      // Determine status based on action type
      const status = actionType === 'draft' ? 'draft' : 'pending';
      
      const response = await newsService.createNews({
        ...formData,
        status: status // Explicitly set status
      });
      
      if (response.status === 'success') {
        const message = actionType === 'draft' 
          ? "News berhasil disimpan sebagai draft!" 
          : "News berhasil disubmit untuk review!";
        showNotification("success", message);
        setTimeout(() => {
          navigate('/admin/news');
        }, 1500);
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal menambahkan news!");
    } finally {
      setLoading(false);
    }
  };

  // Handle insert image
  const handleInsertImage = () => {
    if (imageUrl.trim()) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageModal(false);
      showNotification("success", "Gambar berhasil ditambahkan!");
    }
  };

  // Handle insert video (iframe for YouTube/Vimeo)
  const handleInsertVideo = () => {
    if (videoUrl.trim()) {
      let embedUrl = videoUrl;
      
      // Convert YouTube URL to embed
      if (videoUrl.includes('youtube.com/watch')) {
        const videoId = videoUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoUrl.includes('vimeo.com/')) {
        const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
      
      // Insert iframe using custom extension
      editor?.chain().focus().setIframe({ 
        src: embedUrl,
        frameborder: 0,
        allowfullscreen: true
      }).run();
      
      setVideoUrl('');
      setShowVideoModal(false);
      showNotification("success", "Video berhasil ditambahkan!");
    }
  };

  // Handle add tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  // Handle remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

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
          onClick={() => navigate('/admin/news')}
          className="p-2 hover:bg-neutral-light rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-primary">Tambah News</h1>
          <p className="text-secondary mt-1">Buat berita atau artikel perpajakan baru</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Artikel ID & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Artikel ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="artikelId"
              value={formData.artikelId}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              placeholder="Contoh: ART-2024-001"
              required
              maxLength={100}
            />
            <p className="text-xs text-secondary mt-1">
              ID unik untuk artikel (tidak bisa diubah setelah dibuat)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Judul Artikel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              placeholder="Contoh: Perubahan Tarif PPh Tahun 2024"
              required
              maxLength={255}
            />
          </div>
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Kategori
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">Pilih Kategori</option>
              {kategoriOptions.map((kat) => (
                <option key={kat} value={kat}>{kat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Sub Kategori
            </label>
            <select
              name="subKategori"
              value={formData.subKategori}
              onChange={handleChange}
              disabled={!formData.kategori}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Pilih Sub Kategori</option>
              {availableSubKategori.map((subKat) => (
                <option key={subKat} value={subKat}>{subKat}</option>
              ))}
            </select>
            {!formData.kategori && (
              <p className="text-xs text-secondary mt-1">
                Pilih kategori terlebih dahulu
              </p>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            URL Gambar Cover
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            placeholder="https://example.com/image.jpg"
            maxLength={500}
          />
          {formData.image && (
            <div className="mt-3 border-2 border-gray-200 rounded-lg p-2">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="max-h-40 rounded-lg mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Short Content/Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Ringkasan/Excerpt
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            placeholder="Ringkasan singkat artikel yang akan ditampilkan di list..."
          />
          <p className="text-xs text-secondary mt-1">
            Ringkasan akan ditampilkan sebagai preview di daftar berita
          </p>
        </div>

        {/* TipTap Editor */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Konten Lengkap Artikel
          </label>
          
          {/* Toolbar */}
          <div className="border-2 border-gray-300 rounded-t-lg bg-gradient-to-r from-gray-50 to-gray-100 p-3">
            {/* Row 1: Text Formatting */}
            <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-gray-300">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all font-bold ${
                  editor?.isActive('bold') ? 'bg-blue-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Bold (Ctrl+B)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all italic ${
                  editor?.isActive('italic') ? 'bg-blue-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Italic (Ctrl+I)"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all underline ${
                  editor?.isActive('underline') ? 'bg-blue-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Underline (Ctrl+U)"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all line-through ${
                  editor?.isActive('strike') ? 'bg-blue-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Strikethrough"
              >
                S
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCode().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all font-mono text-sm ${
                  editor?.isActive('code') ? 'bg-blue-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Inline Code"
              >
                {'</>'}
              </button>
              
              <div className="w-px bg-gray-400 mx-2"></div>
              
              {/* Headings */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all font-bold ${
                  editor?.isActive('heading', { level: 1 }) ? 'bg-purple-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Heading 1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all font-bold ${
                  editor?.isActive('heading', { level: 2 }) ? 'bg-purple-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all font-bold ${
                  editor?.isActive('heading', { level: 3 }) ? 'bg-purple-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Heading 3"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setParagraph().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all ${
                  editor?.isActive('paragraph') ? 'bg-purple-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Paragraph"
              >
                P
              </button>
            </div>

            {/* Row 2: Lists & Alignment */}
            <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-gray-300">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all ${
                  editor?.isActive('bulletList') ? 'bg-green-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Bullet List"
              >
                <span className="font-bold">• List</span>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all ${
                  editor?.isActive('orderedList') ? 'bg-green-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Numbered List"
              >
                <span className="font-bold">1. List</span>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all ${
                  editor?.isActive('blockquote') ? 'bg-green-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Quote"
              >
                <span className="font-bold">"</span>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all font-mono text-sm ${
                  editor?.isActive('codeBlock') ? 'bg-green-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Code Block"
              >
                {'{ }'}
              </button>
              
              <div className="w-px bg-gray-400 mx-2"></div>
              
              {/* Alignment */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all ${
                  editor?.isActive({ textAlign: 'left' }) ? 'bg-orange-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Align Left"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 4h16v2H2V4zm0 4h10v2H2V8zm0 4h16v2H2v-2zm0 4h10v2H2v-2z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all ${
                  editor?.isActive({ textAlign: 'center' }) ? 'bg-orange-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Align Center"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 4h16v2H2V4zm3 4h10v2H5V8zm-3 4h16v2H2v-2zm3 4h10v2H5v-2z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all ${
                  editor?.isActive({ textAlign: 'right' }) ? 'bg-orange-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Align Right"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 4h16v2H2V4zm6 4h10v2H8V8zm-6 4h16v2H2v-2zm6 4h10v2H8v-2z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                className={`px-3 py-2 rounded-lg hover:bg-white transition-all ${
                  editor?.isActive({ textAlign: 'justify' }) ? 'bg-orange-500 text-white shadow-md' : 'bg-white'
                }`}
                title="Justify"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 4h16v2H2V4zm0 4h16v2H2V8zm0 4h16v2H2v-2zm0 4h16v2H2v-2z"/>
                </svg>
              </button>
            </div>

            {/* Row 3: Media & Actions */}
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="px-3 py-2 rounded-lg hover:bg-teal-50 transition-all bg-white text-teal-600 font-semibold"
                title="Insert Image"
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Image
              </button>
              
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="px-3 py-2 rounded-lg hover:bg-pink-50 transition-all bg-white text-pink-600 font-semibold"
                title="Insert Video"
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video
              </button>
              
              <div className="w-px bg-gray-400 mx-2"></div>
              
              <button
                type="button"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                className="px-3 py-2 rounded-lg hover:bg-white transition-all bg-white"
                title="Horizontal Line"
              >
                <span className="text-sm">───</span>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setHardBreak().run()}
                className="px-3 py-2 rounded-lg hover:bg-white transition-all bg-white text-sm"
                title="Line Break"
              >
                ↵ Break
              </button>
              
              <div className="w-px bg-gray-400 mx-2"></div>
              
              <button
                type="button"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
                className="px-3 py-2 rounded-lg hover:bg-white transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
                className="px-3 py-2 rounded-lg hover:bg-white transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </button>
              
              <div className="w-px bg-gray-400 mx-2"></div>
              
              <button
                type="button"
                onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
                className="px-3 py-2 rounded-lg hover:bg-red-50 transition-all bg-white text-red-600 text-sm font-semibold"
                title="Clear Formatting"
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="border-2 border-t-0 border-gray-300 rounded-b-lg bg-white shadow-inner">
            <EditorContent 
              editor={editor} 
              className="prose prose-lg max-w-none p-6 min-h-[500px] focus:outline-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Tags
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            placeholder="Ketik tag dan tekan Enter..."
          />
          <p className="text-xs text-secondary mt-1">
            Tekan Enter untuk menambahkan tag
          </p>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center space-x-2">
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-900 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
          >
            Batal
          </button>
          
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : '📄 Simpan sebagai Draft'}
          </button>
          
          <button
            type="button"
            onClick={() => handleSubmit('publish')}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {loading ? 'Mengirim...' : '🚀 Submit untuk Review'}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-primary mb-2">Insert Image</h3>
              <p className="text-center text-secondary mb-4 text-sm">
                Masukkan URL gambar yang ingin ditampilkan
              </p>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowImageModal(false); setImageUrl(''); }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleInsertImage}
                  disabled={!imageUrl.trim()}
                  className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-primary mb-2">Insert Video</h3>
              <p className="text-center text-secondary mb-4 text-sm">
                Masukkan URL video YouTube atau Vimeo
              </p>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none mb-4"
                autoFocus
              />
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded text-sm">
                <p className="text-blue-800 mb-2">
                  <strong>Contoh URL YouTube:</strong>
                </p>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                  <li>https://youtu.be/VIDEO_ID</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowVideoModal(false); setVideoUrl(''); }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleInsertVideo}
                  disabled={!videoUrl.trim()}
                  className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
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
        
        .ProseMirror li {
          margin: 0.25rem 0;
          display: list-item;
        }
        
        .ProseMirror li p {
          margin: 0;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .ProseMirror pre {
          background: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        
        .ProseMirror pre code {
          background: none;
          color: inherit;
          font-size: 0.875rem;
          padding: 0;
        }
        
        .ProseMirror code {
          background: #f3f4f6;
          color: #ef4444;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: monospace;
        }
        
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }
        
        /* Video Wrapper for responsive embed */
        .ProseMirror .video-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          max-width: 100%;
          margin: 1rem 0;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        
        .ProseMirror .video-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
          border-radius: 0.5rem;
        }
        
        .ProseMirror iframe {
          max-width: 100%;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default AddNewsPage;