"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminHeader from '../components/AdminHeader';
import Link from 'next/link';

// Types
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  category: string;
  published_at: string | null;
  author_name: string;
  created_at: string;
};

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const supabase = createClient();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTogglePublish = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const newPublishedAt = newStatus === 'published' ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: newStatus, published_at: newPublishedAt })
        .eq('id', post.id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post => filter === 'all' ? true : post.status === filter);
  
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const draftPosts = posts.filter(p => p.status === 'draft').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0B09', color: '#EAD9C3', fontFamily: 'var(--font-body), sans-serif' }}>
      <AdminHeader title="Blog Management" />
      
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading), serif', fontSize: '2rem', color: '#C7A064', marginBottom: '0.5rem' }}>Journal Articles</h1>
            <p style={{ color: 'rgba(234, 217, 195, 0.7)' }}>Manage your skincare journal and educational content.</p>
          </div>
          <Link href="/admin/blog/new" style={{
            backgroundColor: '#C7A064',
            color: '#0D0B09',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            fontWeight: 500,
            borderRadius: '4px',
            fontSize: '0.9rem',
            transition: 'background-color 0.2s'
          }}>
            + New Article
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(199, 160, 100, 0.2)', padding: '1.5rem', borderRadius: '4px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'rgba(234, 217, 195, 0.7)', marginBottom: '0.5rem' }}>Total Articles</h3>
            <p style={{ fontSize: '2rem', fontFamily: 'var(--font-heading), serif', color: '#C7A064' }}>{totalPosts}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(199, 160, 100, 0.2)', padding: '1.5rem', borderRadius: '4px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'rgba(234, 217, 195, 0.7)', marginBottom: '0.5rem' }}>Published</h3>
            <p style={{ fontSize: '2rem', fontFamily: 'var(--font-heading), serif', color: '#C7A064' }}>{publishedPosts}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(199, 160, 100, 0.2)', padding: '1.5rem', borderRadius: '4px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'rgba(234, 217, 195, 0.7)', marginBottom: '0.5rem' }}>Drafts</h3>
            <p style={{ fontSize: '2rem', fontFamily: 'var(--font-heading), serif', color: '#C7A064' }}>{draftPosts}</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(199, 160, 100, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(199, 160, 100, 0.2)', display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setFilter('all')}
              style={{ background: 'none', border: 'none', color: filter === 'all' ? '#C7A064' : 'rgba(234, 217, 195, 0.7)', cursor: 'pointer', fontSize: '0.9rem', padding: '0.5rem 1rem', borderBottom: filter === 'all' ? '2px solid #C7A064' : '2px solid transparent' }}
            >
              All Articles
            </button>
            <button 
              onClick={() => setFilter('published')}
              style={{ background: 'none', border: 'none', color: filter === 'published' ? '#C7A064' : 'rgba(234, 217, 195, 0.7)', cursor: 'pointer', fontSize: '0.9rem', padding: '0.5rem 1rem', borderBottom: filter === 'published' ? '2px solid #C7A064' : '2px solid transparent' }}
            >
              Published
            </button>
            <button 
              onClick={() => setFilter('draft')}
              style={{ background: 'none', border: 'none', color: filter === 'draft' ? '#C7A064' : 'rgba(234, 217, 195, 0.7)', cursor: 'pointer', fontSize: '0.9rem', padding: '0.5rem 1rem', borderBottom: filter === 'draft' ? '2px solid #C7A064' : '2px solid transparent' }}
            >
              Drafts
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(199, 160, 100, 0.2)', color: 'rgba(234, 217, 195, 0.7)', fontWeight: 500, fontSize: '0.9rem' }}>Title</th>
                  <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(199, 160, 100, 0.2)', color: 'rgba(234, 217, 195, 0.7)', fontWeight: 500, fontSize: '0.9rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(199, 160, 100, 0.2)', color: 'rgba(234, 217, 195, 0.7)', fontWeight: 500, fontSize: '0.9rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(199, 160, 100, 0.2)', color: 'rgba(234, 217, 195, 0.7)', fontWeight: 500, fontSize: '0.9rem' }}>Author</th>
                  <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(199, 160, 100, 0.2)', color: 'rgba(234, 217, 195, 0.7)', fontWeight: 500, fontSize: '0.9rem' }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(199, 160, 100, 0.2)', color: 'rgba(234, 217, 195, 0.7)', fontWeight: 500, fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(234, 217, 195, 0.7)' }}>Loading articles...</td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(234, 217, 195, 0.7)' }}>No articles found.</td>
                  </tr>
                ) : (
                  filteredPosts.map(post => (
                    <tr key={post.id} style={{ borderBottom: '1px solid rgba(199, 160, 100, 0.1)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{post.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(234, 217, 195, 0.5)' }}>/{post.slug}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '1rem',
                          fontSize: '0.8rem',
                          backgroundColor: post.status === 'published' ? 'rgba(199, 160, 100, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                          color: post.status === 'published' ? '#C7A064' : 'rgba(234, 217, 195, 0.7)'
                        }}>
                          {post.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'rgba(234, 217, 195, 0.8)' }}>{post.category}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'rgba(234, 217, 195, 0.8)' }}>{post.author_name}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'rgba(234, 217, 195, 0.8)' }}>
                        {post.published_at 
                          ? new Date(post.published_at).toLocaleDateString() 
                          : new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => handleTogglePublish(post)}
                            style={{ background: 'none', border: 'none', color: 'rgba(234, 217, 195, 0.7)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                          >
                            {post.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <Link 
                            href={`/admin/blog/${post.id}/edit`}
                            style={{ color: '#C7A064', textDecoration: 'none', fontSize: '0.9rem' }}
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
