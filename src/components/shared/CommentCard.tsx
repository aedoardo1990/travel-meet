import { useUserContext } from '@/context/AuthContext';
import { formatDateString } from '@/lib/utils';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
// import PostStats from './PostStats';

type CommentCardProps = {
    comment: Models.Document;
}

const CommentCard = ({ comment }: CommentCardProps) => {
    const { user } = useUserContext();

    if (!comment.creator) return;

    return (
        <div className='comment-card'>
            <div className='flex-between'>
                <div className='flex items-center gap-3'>
                    <Link to={`/profile/${comment.creator.$id}`}>
                        <img
                            src={comment?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            alt='creator'
                            className='rounded-full w-12 lg:h-12'
                        />
                    </Link>
                    <div className='flex flex-col'>
                        <p className='base-medium lg:body-bold text-light-1'>
                            {comment.creator.name}
                        </p>
                        <div className='flex-center gap-2 text-light-3'>
                            <p className='subtle-semibold lg:small-regular'>
                                {formatDateString(comment.$createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
                {/*This Link will be showing just if we are the ones who created the comment*/}
                <Link to={`/update-comment/${comment.$id}`}
                    className={`${user.id !== comment.creator.$id && 'hidden'}`}>
                    <img
                        src='/assets/icons/edit.svg'
                        alt='edit'
                        width={20}
                        height={20}
                    />
                </Link>
            </div>
            <Link to={`/comments/${comment.$id}`}>
                <div className='small-medium lg:base-medium py-5'>
                    <p>{comment.TextComment}</p>

                </div>
            </Link>
        </div>
    )
}

export default CommentCard