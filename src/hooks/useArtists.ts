import { useState } from "react";
import type { Artist, ArtistIndex } from "../types/types";

/**
 * The useArtists hook manages the state of loading and storing artists with their albums.
 * It provides a function to load the artists from the API.
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
    const index: ArtistIndex = await indexResponse.json();

    // the artist (without albums) are fetched in parallel and their promises collected
    const promises = index.artists.map(artist => fetchArtist(artist.id));

    // wait for promises in parallel and collect their results in the correct order
    const artists = await Promise.all(promises);

    return artists;
}


async function fetchArtist(artistId: number): Promise<Artist> {
    const artistResponse = await fetch(`/json-demo/api/artists/${artistId}.json`);
    if (!artistResponse.ok) {
        throw new Error(`HTTP error receiving artist ${artistId}: ${artistResponse.status}`);
    }
    return await artistResponse.json();
}
