import { MyImage } from "../image.model"
import { Program } from "./program.model"

export class TvSerie {
    id: number = 0
    imageId: number | null = null
    title: string = ""
    image: MyImage | null = null
    
    constructor(program: Program) {
        this.id = program.tvSerieId ?? 0;
        this.imageId = program.imageId;
        this.title = program.title;
        this.image = program.image;
    }

    equals(other: TvSerie): boolean {
        if (!other) return false;
        return (
            this.imageId === other.imageId &&
            this.title === other.title
        );
    }
}
