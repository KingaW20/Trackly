import { Program } from "./program.model"
import { TvSerie } from "./tv-serie.model"

export class TvSerieEpisode {
    id: number = 0
    tvSerieId: number | null = null
    season: number = 0
    episode: number = 0
    time: number = 0
    tvSerie: TvSerie | null = null

    constructor(program: Program) {
        this.id = program.id;
        this.tvSerieId = program.tvSerieId;
        this.season = program.season;
        this.episode = program.episode;
        this.time = program.time;
    }

    equals(other: TvSerieEpisode): boolean {
        if (!other) return false;
        return (
            this.tvSerieId === other.tvSerieId &&
            this.season === other.season &&
            this.episode === other.episode &&
            this.time === other.time
        );
    }
}
