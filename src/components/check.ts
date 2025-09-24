import type { Artist } from "../types/types";

type CheckResult = {
    pass: boolean;
    message: string;
};

export function checkSolution(artists: Artist[]): CheckResult {
    const checks = [checkLength(artists), checkAlbums(artists), checkOrder(artists)];

    for (const check of checks) {
        if (!check.pass) {
            return check;
        }
    }

    return { pass: true, message: 'Congratulations! Everything seems to be ok :)' };
}


function checkLength(artists: Artist[]): CheckResult {
    if (artists.length !== 275) {
        return { pass: false, message: `There should be 275 artists, but you have ${artists.length}.` };
    }
    return { pass: true, message: 'ok' };
}

function checkAlbums(artists: Artist[]): CheckResult {
    if (artists.some(artist => !("albums" in artist))) {
        return { pass: false, message: `Some artists are missing albums.` };
    }
    return { pass: true, message: 'ok' };
}

function checkOrder(artists: Artist[]): CheckResult {
    const ids = artists.map(artist => artist.id);

    // leave out the last, as it can't be compared to anything after it
    const idsInAscendingOrder = ids.slice(0, -1)
        .every((id, position, array) => {
            // the current id must be less than the next id
            return id < array[position + 1];
        });

    if (!idsInAscendingOrder) {
        return { pass: false, message: `Artists are not in ascending order by id.` };
    }
    return { pass: true, message: 'ok' };
}

