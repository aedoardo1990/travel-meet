import Loader from './Loader'
import { Models } from 'appwrite';
import GridPostList from './GridPostList';

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
}

const SearchResults = ({ isSearchFetching, searchedPosts}: SearchResultsProps) => {
  if(isSearchFetching) return <Loader />

  if(searchedPosts && searchedPosts.documents.length > 0) { //DOUBLE BUG
    return (
      <GridPostList posts={searchedPosts.documents}/>
    )
  }
  return (

    <p className='text-ligth-4 mt-10 text-center w-full'>
      No results found
    </p>
  )
}

export default SearchResults