import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h2>
        <p className="text-gray-600 mb-4">By {post.authorName} on {new Date(post.createdAt).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-4">
            {post.content.substring(0, 150)}...
        </p>
        <Link to={`/post/${post._id}`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
