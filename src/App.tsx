import { useState } from 'react'
import type { Artist, ArtistIndex } from './types/types';
import { ArtistComponent } from './components/ArtistComponent';
import { ResultCheck } from './components/ResultCheck';

function App() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    /**
     * The following function loads a list of articles from a dummy REST API.
     * The initial list contains only basic information about each artist, but not their albums.
     * Therefore, after fetching the list, we need to fetch each artist separately to get the albums.
     * This is done by making additional fetch requests for each artist in the list.
     * The function updates the state with the fetched artists and their albums.
     *
     * There are some bugs included in this function, especially in the asynchronous handling of fetch requests.
     * When experimenting with the app, make note of the loading indicator and when it disappears. Also,
     * check the order in which artists and albums are displayed. These are indicators of potential issues.
     *
     * Your task is to fix these issues. You may either fix individual bugs or rewrite the function entirely.
     * Also, consider moving the function to a separate file, as it is quite large and not directly related to the UI.
     */
    function loadArtists() {
        setLoading(true);
        setArtists([]);

        // fetch a list of artists (the list does not contain albums)
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

                    // fetch the current artist details (including albums)
                    fetch(`/json-demo/api/artists/${artist.id}.json`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error receiving artist ${artist.id}: ${response.status}`);
                            }
                            return response.json() as Promise<Artist>;
                        })
                        .then(artist => {
                            // add the artist (now with albums) to the list
                            setArtists(previous => [...previous, artist]);
                        })
                        .catch(error => {
                            console.error(`Error fetching details for artist ${artist.id}.`, error);
                        });
                });

            }).catch(error => {
                console.error('Error fetching artist index:', error);
                alert('Failed to load artist index. See console for details.');

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
