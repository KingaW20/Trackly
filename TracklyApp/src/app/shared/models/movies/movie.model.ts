import { MyImage } from "../image.model"
import { Program } from "./program.model"

export class Movie {
    id: number = 0
    imageId: number | null = null
    title: string = ""
    time: number = 0
    image: MyImage | null = null

    constructor(program: Program) {
        this.id = program.id;
        this.imageId = program.imageId;
        this.title = program.title;
        this.time = program.time;
        this.image = program.image;
    }

    equals(other: Movie): boolean {
        if (!other) return false;
        return (
            this.imageId === other.imageId &&
            this.title === other.title &&
            this.time === other.time
        );
    }
}
