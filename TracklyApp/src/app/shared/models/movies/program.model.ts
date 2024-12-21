import { MyImage } from "../image.model"

export class Program {
    id: number = 0                      // movie id or tv serie episode id
    imageId: number | null = null
    title: string = ""
    time: number = 0
    image: MyImage | null = null
    // fields that belong to tv serie episode
    tvSerieId: number | null = null
    season: number = 0
    episode: number = 0

    constructor(prog: {
        id?: number,
        imageId?: number | null,
        title?: string,
        time?: number,
        image?: MyImage | null,
        tvSerieId?: number | null,
        season?: number,
        episode?: number
    }) {
        this.id = prog.id ?? 0;
        this.imageId = prog.imageId ?? null;
        this.title = prog.title ?? "";
        this.time = prog.time ?? 0;
        this.image = prog.image ?? null;

        this.tvSerieId = prog.tvSerieId ?? null;
        this.season = prog.season ?? 0;
        this.episode = prog.episode ?? 0;
    }
}
