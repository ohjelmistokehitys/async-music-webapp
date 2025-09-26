import { useState } from "react";
import type { Artist, ArtistIndex } from "../types/types";

/**
 * Fourth iteration of refactoring the artist loading logic.
 *
 * This time we refactor fetchArtistsWithAlbums to utilize async/await syntax,
 * which in this case makes the code a bit more readable.
 *
 * The hook itself remains unchanged. This solution, however, is slow as ****
 * because the artists are fetched one by one, waiting for each to complete
 * before starting the next.
 */
export function useArtists() {

    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);

    async function loadArtists() {
        setLoading(true);
        setArtists([]);

        const artists = await fetchArtistsWithAlbums();

        setArtists(artists);
        setLoading(false);
    }

    return { loading, artists, loadArtists };
}


async function fetchArtistsWithAlbums(): Promise<Artist[]> {
    const indexResponse = await fetch('/json-demo/api/artists.json');
    if (!indexResponse.ok) {
        throw new Error(`HTTP error receiving artists list: ${indexResponse.status}`);
    }
    const artistIndex: ArtistIndex = await indexResponse.json();

    const artists: Artist[] = [];

    for (const artist of artistIndex.artists) {
        const artistResponse = await fetch(`/json-demo/api/artists/${artist.id}.json`);
        if (!artistResponse.ok) {
            throw new Error(`HTTP error receiving artist ${artist.id}: ${artistResponse.status}`);
        }
        const artistData: Artist = await artistResponse.json();
        artists.push(artistData);
    }

    return artists;
}
