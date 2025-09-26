import { useState } from 'react'
import { ArtistComponent } from './components/ArtistComponent';
import { ResultCheck } from './components/ResultCheck';
import { useArtists } from './hooks/useArtists';

function App() {

    const [dialogOpen, setDialogOpen] = useState(false);
    const { loading, artists, loadArtists } = useArtists();

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
