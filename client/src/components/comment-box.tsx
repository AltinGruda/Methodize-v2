import { Forward } from 'lucide-react';
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import Avatar from 'boring-avatars';
import { useAuth } from '@/context/useAuth';

interface Comment {
  id: number;
  username: string;
  text: string;
}

const CommentBox = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const {user} = useAuth();

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newComment: Comment = {
      id: Date.now(),
      username: 'John Doe', // You can replace this with the actual username from your authentication system
      text: inputValue,
    };

    setComments([...comments, newComment]);
    setInputValue('');
  };

  const commentsBodyRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleAddComment(e as FormEvent); // Trigger form submission
    }
  };



  useEffect(() => {
    // Scroll to the bottom when messages change
    if (commentsBodyRef.current) {
      commentsBodyRef.current.scrollTop = commentsBodyRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div className="lg:max-w-md w-full p-6 bg-white overflow-y-scroll h-3/4 absolute bottom-5" ref={commentsBodyRef}>
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start mb-4">
            <img src={`https://source.unsplash.com/50x50/?avatar&${comment.id}`} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
            <div>
              <p className="text-gray-800 font-semibold">{comment.username}</p>
              <p className="text-gray-600">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="flex items-center mb-4" onSubmit={handleAddComment}>
        <div className='mr-2'>
          <Avatar
            size={40}
            name={user?.name}// change this to user.name
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}     
          />
        </div>
        <textarea
          className="w-full p-1 border-2 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Add your comment..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleTextareaKeyDown}
          ref={textareaRef}
        ></textarea>
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
          <Forward className='w-5' />
        </button>
      </form>
    </div>
  );
};

export default CommentBox;
