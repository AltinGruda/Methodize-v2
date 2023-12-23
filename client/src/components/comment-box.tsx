import { Forward } from 'lucide-react';
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import Avatar from 'boring-avatars';
import { useAuth } from '@/context/useAuth';
import { Comment } from '@/models/Comment';
import { toast } from './ui/use-toast';

function CommentBox({taskId}: {taskId: string}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const {user} = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Call your backend API to fetch comments
        const response = await fetch(`http://localhost:5000/project/task/${taskId}/comments`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const commentsData = await response.json();
        const commentsWithUserDetails = await Promise.all(
          commentsData.map(async (comment: Comment) => {
            const userData = await fetchUserById(comment.userId);
            return {
              ...comment,
              user: userData,
            };
          })
        );
        setComments(commentsWithUserDetails);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchComments();
  }, [taskId]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
  
    try {
      // Call your backend API to add a comment
      const response = await fetch(`http://localhost:5000/project/task/${taskId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputValue,
          userId: user?._id, // Use the actual user ID from your authentication system
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
  
      const newComment = await response.json();

      // Fetch user details for the new comment
      const userData = await fetchUserById(newComment.userId);
      const commentWithUserDetails = {
        ...newComment,
        user: userData,
      };
      
      setComments([...comments, commentWithUserDetails]);
      setInputValue('');
    } catch (error) {
      console.error(error);
      toast({
        title: "Error posting a comment.",
        variant: "destructive"
      })
    }
  };
  
  console.log(comments);
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

  const fetchUserById = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="lg:max-w-md w-full p-6 bg-white overflow-y-scroll h-3/4 absolute bottom-5" ref={commentsBodyRef}>
      <div>
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-start mb-4">
            {/* <img src={`https://source.unsplash.com/50x50/?avatar&${comment._id}`} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" /> */}
            {Array.isArray(comment.user) && comment.user.map((user) => (
              <div className='mr-2' key={user._id}>
                <Avatar
                  size={35}
                  name={user.name}// change this to user.name
                  variant="beam"
                  colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}     
                />
              </div>
            ))}
            <div>
              {Array.isArray(comment.user) && comment.user.map((user) => (
                <p key={user._id} className="text-gray-800 font-semibold">{user.name}</p>
              ))}
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
}

export default CommentBox;
