import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import './Tab2.css';

interface Tab2 extends RouteComponentProps<{
  id: string;
}> {}

function Tab2({match}) {
  const [movie, setMovie] = useState<any>({});
  const [image, setImage] = useState<any>();

  function isImageNull(val = null) {
    if (val === null) {
      return "https://images.pexels.com/photos/62693/pexels-photo-62693.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200";
    } else {
      return "https://image.tmdb.org/t/p/w200"+val;
    }
  }

  const fetchData = async () => {
    const apiUrl = 'https://api.themoviedb.org/3/movie/'+match.params.id+'?api_key='+process.env.REACT_APP_API_KEY;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setImage(isImageNull(data.poster_path))
        setMovie(data)
      });
  };

  useEffect(() => {
    fetchData();
  }, [setMovie, setImage]);

  return (
    <IonPage>
      <IonHeader>
      <IonToolbar>
          <IonTitle>{movie.original_title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main>
          <div className="poster">
            <img src={image} />
          </div>
          <h1>{movie.original_title}</h1>
          <p className="tagline">{movie.tagline}</p>
          <div className="overview">
            <p>{movie.overview}</p>
          </div>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
