
import SearchResults from './searchResults'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import SearchError from './error';
import LoadingSearchResults from './loading';


export default function Page({params}:{params:{searchQuery:string}}) {
  // const searchParam = useSearchParams().get('q');
  // const [searchQuery, setSearchQuery] = useState(searchParam ? searchParam : '');
  const searchQuery = decodeURI(params.searchQuery).replaceAll('+', ' ');

  return (
    <main className="relative flex flex-col">
      <ErrorBoundary errorComponent={SearchError}>
        <Suspense fallback={<LoadingSearchResults/>}>
          {(searchQuery && searchQuery!='') ? <SearchResults styles=' h-full overflow-y-auto' searchQuery={searchQuery}  /> : ''}
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}



