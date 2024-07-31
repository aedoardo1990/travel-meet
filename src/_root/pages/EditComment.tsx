import CommentForm from '@/components/forms/CommentForm';
import { useGetCommentById } from '@/lib/react-query/queriesAndMutations';
import { useParams } from 'react-router-dom'
import Loader from '@/components/shared/Loader';

const EditComment = () => {
  // to get the post we want to edit
  const { id } = useParams();
  const { data: comment, isPending } = useGetCommentById(id || '');

  if (isPending) return <Loader />

  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
          <img 
          src='/assets/icons/add-post.svg'
          width={36}
          height={36}
          alt='add'
          />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Comment Post</h2>
        </div>
        {/*once we fetch the data, we pass them over to the post form*/}
        <CommentForm action='Update' comment={comment} />
      </div>
    </div>
  )
}

export default EditComment