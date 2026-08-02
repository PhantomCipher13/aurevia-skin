"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminHeader from '../../components/AdminHeader';
import Link from 'next/link';

export default function NewArticlePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Routine',
    tags: '',
    cover_image_url: '',
    meta_title: '',
    meta_description: '',
    read_time: '',
    author_name: 'Aurevia Skin'
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const slug = generateSlug(formData.title);
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const readTimeInt = parseInt(formData.read_time) || 5;

      const postData = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: tagsArray,
        cover_image_url: formData.cover_image_url,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt,
        read_time: readTimeInt,
        author_name: formData.author_name,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
      };

      const { error: dbError } = await supabase
        .from('blog_posts')
        .insert([postData]);

      if (dbError) throw dbError;

      router.push('/admin/blog');
    } catch (err: any) {
      console.error('Error saving article:', err);
      setError(err.message || 'Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(199, 160, 100, 0.2)',
    color: '#EAD9C3',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: 'rgba(234, 217, 195, 0.9)',
    fontSize: '0.9rem'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0B09', color: '#EAD9C3', fontFamily: 'var(--font-body), sans-serif' }}>
      <AdminHeader title="New Article" />
      
      <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <Link href="/admin/blog" style={{ color: '#C7A064', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
              &larr; Back to Articles
            </Link>
            <h1 style={{ fontFamily: 'var(--font-heading), serif', fontSize: '2rem', color: '#C7A064' }}>Create New Article</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #C7A064',
                color: '#C7A064',
                padding: '0.75rem 1.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                borderRadius: '4px'
              }}
            >
              Save Draft
            </button>
            <button 
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={loading}
              style={{
                backgroundColor: '#C7A064',
                border: '1px solid #C7A064',
                color: '#0D0B09',
                padding: '0.75rem 1.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                borderRadius: '4px'
              }}
            >
              Publish Now
            </button>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', border: '1px solid #e74c3c', color: '#e74c3c', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(199, 160, 100, 0.2)', padding: '2rem', borderRadius: '4px', marginBottom: '2rem' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="The Ultimate Guide to Hydration"
                  required
                />
                {formData.title && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(234, 217, 195, 0.5)' }}>
                    Slug: {generateSlug(formData.title)}
                  </div>
                )}
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Excerpt (Summary)</label>
                <textarea 
                  name="excerpt" 
                  value={formData.excerpt} 
                  onChange={handleChange} 
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                  placeholder="A brief summary of the article..."
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Content</label>
                <textarea 
                  name="content" 
                  value={formData.content} 
                  onChange={handleChange} 
                  style={{ ...inputStyle, minHeight: '400px', resize: 'vertical' }} 
                  placeholder="Write your article content here (Markdown/HTML supported if configured)..."
                  required
                />
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(199, 160, 100, 0.2)', padding: '2rem', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading), serif', color: '#C7A064', marginBottom: '1.5rem', fontSize: '1.2rem' }}>SEO Settings</h3>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Meta Title</label>
                <input 
                  type="text" 
                  name="meta_title" 
                  value={formData.meta_title} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="Leave blank to use article title"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Meta Description</label>
                <textarea 
                  name="meta_description" 
                  value={formData.meta_description} 
                  onChange={handleChange} 
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                  placeholder="Leave blank to use excerpt"
                />
              </div>
            </div>
          </div>

          <div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(199, 160, 100, 0.2)', padding: '2rem', borderRadius: '4px', position: 'sticky', top: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading), serif', color: '#C7A064', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Organization</h3>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  style={inputStyle}
                >
                  <option value="Routine">Routine</option>
                  <option value="Science">Science</option>
                  <option value="Education">Education</option>
                  <option value="Ritual">Ritual</option>
                  <option value="Tips">Tips</option>
                </select>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Author</label>
                <input 
                  type="text" 
                  name="author_name" 
                  value={formData.author_name} 
                  onChange={handleChange} 
                  style={inputStyle} 
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input 
                  type="text" 
                  name="tags" 
                  value={formData.tags} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="hydration, serums, routine"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Read Time (minutes)</label>
                <input 
                  type="number" 
                  name="read_time" 
                  value={formData.read_time} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="5"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Cover Image URL</label>
                <input 
                  type="text" 
                  name="cover_image_url" 
                  value={formData.cover_image_url} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  placeholder="https://..."
                />
                {formData.cover_image_url && (
                  <div style={{ marginTop: '1rem', width: '100%', height: '150px', backgroundImage: `url(${formData.cover_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px' }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
