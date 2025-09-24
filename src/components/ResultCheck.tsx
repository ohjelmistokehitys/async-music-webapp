import { checkSolution } from "./check";
import type { Artist } from "../types/types";

export function ResultCheck({ artists, close }: { artists: Artist[]; close: () => void }) {

    const { pass, message } = checkSolution(artists);

    return <dialog open onClose={close}>
        <article>
            <header>
                <button aria-label="Close" rel="prev" onClick={close}></button>
                <p>
                    <strong>{pass ? '✅ Success!' : '❌ Error'}!</strong>
                </p>
            </header>
            <p>
                {message}
            </p>
        </article>
    </dialog>
}
