/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/${postId}`);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/comments/${postId}`, { content: newComment });
      setNewComment('');
      fetchComments(); // Refetch comments after submission
    } catch (error) {
      console.error('Failed to post comment', error);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if(window.confirm("Are you sure you want to delete this comment?")){
       try {
        await api.delete(`/comments/${commentId}`);
        fetchComments(); // Refetch
       } catch (error) {
        console.error("Failed to delete comment", error);
       }
    }
  }

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Comments</h3>
      {user ? (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            className="w-full p-2 border rounded-md"
            rows="3"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="mb-4">You must be <Link to="/login" className="text-blue-500">logged in</Link> to comment.</p>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="border p-4 rounded-md bg-gray-50">
              <p className="text-gray-800">{comment.content}</p>
              <div className="flex justify-between items-center mt-2">
                <small className="text-gray-500">
                  By {comment.authorName} on {new Date(comment.createdAt).toLocaleDateString()}
                </small>
                {user && (user.isAdmin || user._id === comment.user) && (
                     <button onClick={() => handleDeleteComment(comment._id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
