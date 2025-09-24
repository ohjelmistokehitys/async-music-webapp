import { useState } from 'react'
import type { Artist, ArtistIndex } from './types/types';
import { ArtistComponent } from './components/ArtistComponent';
import { ResultCheck } from './components/ResultCheck';

function App() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    function loadArtists() {
        setLoading(true);
        setArtists([]);

        fetch('/json-demo/api/artists.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error receiving artists list: ${response.status}`);
                }
                return response.json();
            })
            .then((artistIndex: ArtistIndex) => {

                // the response contains all artists, but without albums
                // we need to fetch each artist separately to get the albums:
                artistIndex.artists.forEach((artist: Artist) => {

                    // fetch the current artist details
                    fetch(`/json-demo/api/artists/${artist.id}.json`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error receiving artist ${artist.id}: ${response.status}`);
                            }
                            return response.json() as Promise<Artist>;
                        })
                        .then(artist => {
                            // add the artist (with albums) to the list
                            setArtists(previous => [...previous, artist]);
                        })
                        .catch(error => {
                            console.error('Error fetching artist details:', error);
                        });
                });

            }).catch(error => {
                console.error('Error fetching artist index:', error);

            }).finally(
                // when everything is done (or has failed), stop showing the loading indicator
                () => setLoading(false)
            );
    }


    return (
        <main className="container">

            {dialogOpen ? <ResultCheck artists={artists} close={() => setDialogOpen(false)} /> : null}

            <header>
                <div role="group">
                    <button onClick={loadArtists}>Load artists</button>
                    <button className="secondary" onClick={() => setDialogOpen(true)}>Check results</button>
                </div>
            </header>

            <section>
                <h1>Artists ({artists.length})</h1>
            </section>

            <section>
                {loading ? <progress /> : null}

                {artists.map((artist) => <ArtistComponent key={`artist-${artist.id}`} artist={artist} />)}

            </section>
        </main>
    )
}


export default App
