import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

const PostPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError('Failed to load post.',err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        setError('Failed to delete post.',err);
      }
    }
  };


  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>Post not found.</p>;

  const isAuthor = user && user._id === post.user;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6">By {post.authorName} on {new Date(post.createdAt).toLocaleDateString()}</p>
      
      {isAuthor && (
        <div className="mb-4">
          <Link to={`/edit-post/${post._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600">Edit</Link>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete</button>
        </div>
      )}

      <div className="prose max-w-none text-gray-800" style={{whiteSpace: "pre-wrap"}}>
        {post.content}
      </div>

      <CommentSection postId={id} />
    </div>
  );
};

export default PostPage;
