import { useState } from "react";
import type { Artist, ArtistIndex } from "../types/types";

/**
 * Third iteration of refactoring the artist loading logic.
 *
 * This time we want fetchArtistsWithAlbums to actually return an array of
 * artists, instead of adding them one by one in the callback.
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
    return fetch('/json-demo/api/artists.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error receiving artists list: ${response.status}`);
            }
            return response.json();
        })
        .then((artistIndex: ArtistIndex) => {

            // instead of just looping, we want to create an array of promises, that we can wait for later
            const promises: Promise<Artist>[] = artistIndex.artists.map(artist => {

                // `fetch` returns a promise, that we keep track of in the new promises array
                return fetch(`/json-demo/api/artists/${artist.id}.json`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error receiving artist ${artist.id}: ${response.status}`);
                        }
                        return response.json() as Promise<Artist>;
                    })
                    .catch(error => {
                        console.error(error);
                        throw new Error(`Error fetching details for artist ${artist.id}. See console for details.`);
                    });
            });

            // now each promise in the array will resolve to an Artist object!
            return Promise.all(promises);

        }).then(artists => {
            // as the promises were created synchronously in the correct order, their
            // results will also be in the correct order after Promise.all resolves!
            return artists;
        })
        .catch(error => {
            console.error(error);
            throw new Error('Failed to load artist index. See console for details.');
        });
}
