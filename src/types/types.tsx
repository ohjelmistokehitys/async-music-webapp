export type Artist = {
    id: number,
    name: string,
    albums?: Album[]
}

export type Album = {
    id: number,
    title: string
}

export type ArtistIndex = {
    artists: Artist[]
}
