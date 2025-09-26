import { useState, type Dispatch, type SetStateAction } from "react";
import type { Artist, ArtistIndex } from "../types/types";

/**
 * First iteration of refactoring the artist loading logic.
 *
 * This custom hook contains the initial solution for loading artists,
 * including the bugs mentioned in the exercise instructions.
 *
 * Even though it is not working yet, refactoring the code will hopefully
 * make it easier to design a working solution.
 */
export function useArtists() {

    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);

    async function loadArtists() {
        setLoading(true);
        setArtists([]);

        // FIXME: the loading state is still not working correctly
        await fetchArtistsWithAlbums(setArtists);

        setLoading(false);
    }

    // return the states and the function that were inside the component in the previous version
    return { loading, artists, loadArtists };
}


// FIXME: the artists are still not in the correct order
async function fetchArtistsWithAlbums(callback: Dispatch<SetStateAction<Artist[]>>): Promise<void> {
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
                        callback((array: Artist[]) => [...array, artist]);
                    })
                    .catch(error => {
                        console.error(`Error fetching details for artist ${artist.id}.`, error);
                    });
            });

        }).catch(error => {
            console.error('Error fetching artist index:', error);
            alert('Failed to load artist index. See console for details.');

        });
}
