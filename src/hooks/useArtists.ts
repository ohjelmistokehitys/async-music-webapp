import { useState, type Dispatch, type SetStateAction } from "react";
import type { Artist, ArtistIndex } from "../types/types";

/**
 * Second iteration of refactoring the artist loading logic.
 *
 * This version utilizes Promise.all to figure out when all individual
 * artist fetches have completed.
 *
 * This solves the loading indicator issue, but the artists are still not
 * in the correct order.
 */
export function useArtists() {

    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);

    async function loadArtists() {
        setLoading(true);
        setArtists([]);

        await fetchArtistsWithAlbums(setArtists);

        setLoading(false);
    }

    // return the states and the function that were inside the component in the previous version
    return { loading, artists, loadArtists };
}


// FIXME: the artists are still not in the correct order
async function fetchArtistsWithAlbums(callback: Dispatch<SetStateAction<Artist[]>>): Promise<unknown> {
    return fetch('/json-demo/api/artists.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error receiving artists list: ${response.status}`);
            }
            return response.json();
        })
        .then((artistIndex: ArtistIndex) => {

            // instead of just looping, we want to create an array of promises, that we can wait for later
            const promises = artistIndex.artists.map(artist => {

                // `fetch` returns a promise, that we keep track of in the new promises array
                return fetch(`/json-demo/api/artists/${artist.id}.json`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error receiving artist ${artist.id}: ${response.status}`);
                        }
                        return response.json() as Promise<Artist>;
                    })
                    .then(artist => {
                        // add the artist (now with albums) to the list
                        callback((array: Artist[]) => [...array, artist]);
                    })
                    .catch(error => {
                        console.error(`Error fetching details for artist ${artist.id}.`, error);
                    });
            });

            // by returning a promise from the "then" callback, this function will
            // become a part of the outer promise chain. Thus, the outer promise,
            // that was created when fetchArtistsWithAlbums was called,
            // will not resolve before all individual artist fetches have resolved:
            return Promise.all(promises);

        }).catch(error => {
            console.error('Error fetching artist index:', error);
            alert('Failed to load artist index. See console for details.');

        });
}
