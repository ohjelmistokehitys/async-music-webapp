import type { Artist } from "../types/types";

export function ArtistComponent({ artist }: { artist: Artist }) {
    return (
        <article>
            <h2>{artist.id}: {artist.name}</h2>

            <h3>Albums</h3>
            <ul>
                {artist.albums?.map(album => <li key={`album-${album.id}`}>{album.title}</li>)}
            </ul>
        </article>
    )
}
