import React, { useState } from 'react';
import {
  IonContent, 
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Tab1.css';


function Tab1() {
  const [movies, setMovies] = useState<any>([]);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('Popular');
  const [hidden, setHidden] = useState<boolean>(true);

  async function fetchData(page = null, query = null) {
    if (query !== null && query !== '') {
      const apiUrl = 'https://api.themoviedb.org/3/search/movie/?query='+query+
                    '&page='+page+'&api_key='+process.env.REACT_APP_API_KEY;
      const res: Response = await fetch(apiUrl);
      res
          .json()
          .then(async (res) => {
            if (res && res.results && res.results.length > 0) {
              if (page === 1) {
                setMovies(res.results)
              } else {
                setMovies([...movies, ...res.results])
              }
              setTitle("Search results for '"+query+"'")
              setPage(page+=1)
              setHidden(false)
              setDisableInfiniteScroll(res.results.length < 10)
            } else {
              setDisableInfiniteScroll(true);
            }
          })
          .catch(err => console.error(err));
    } else {
      setTitle('Popular')
      const apiUrl = 'https://api.themoviedb.org/3/movie/popular?page='+page+'&api_key='+process.env.REACT_APP_API_KEY;
      const res: Response = await fetch(apiUrl);
      res
          .json()
          .then(async (res) => {
            if (res && res.results && res.results.length > 0) {
              if (page === 1) {
                setMovies(res.results)
                setHidden(true)
              } else {
                setMovies([...movies, ...res.results])
              }
              setPage(page+=1)
              setDisableInfiniteScroll(res.results.length < 10)
            } else {
              setDisableInfiniteScroll(true);
            }
          })
          .catch(err => console.error(err));
    }
  };
  
  useIonViewWillEnter(async () => {
    await fetchData(page);
  });

  async function searchNext($event: CustomEvent<void>) {
    if (query !== null && query !== '') {
      await fetchData(page, query);
    } else {
      await fetchData(page);
    }
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  async function clear() {
    await fetchData(1);
    setQuery('');
  }

  //console.log(movies, "Movies")

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movies</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Movies</IonTitle>
          </IonToolbar>
        </IonHeader>
        <main>
          <input
            type="text"
            value={query}
            placeholder="search movie database..."
            onChange={event => setQuery(event.target.value)}
          />
          <button type="button" onClick={() => fetchData(1, query)}>
            Search
          </button>
          <br />
          <button className="back" hidden={hidden} onClick={() => clear()}>
            Go Back
          </button>
          <h1>{title}</h1>
          <div className="movies">
            {movies.map((data) => {
              if (data.poster_path === null) {
                return (<a key={data.id} href={"/movie/"+data.id}>
                  <div>
                    <img src="https://images.pexels.com/photos/62693/pexels-photo-62693.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200"></img>
                    <p className="movie-title">{data.original_title}</p>
                    <p>{data.release_date}</p>
                  </div>
                </a>)
              }
              else {
                return (<a key={data.id} href={"/movie/"+data.id}>
                  <div>
                    <img src={"https://image.tmdb.org/t/p/w200"+data.poster_path}></img>
                    <p className="movie-title">{data.original_title}</p>
                    <p>{data.release_date}</p>
                  </div>
                </a>)
              }
            })}
            <IonInfiniteScroll 
              threshold="100px"
              disabled={disableInfiniteScroll}
              onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
              <IonInfiniteScrollContent
                loadingSpinner="bubbles"
                loadingText="Loading more data...">
              </IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </div>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
