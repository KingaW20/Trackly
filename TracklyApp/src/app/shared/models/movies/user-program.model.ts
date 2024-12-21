import { Program } from "./program.model"

export class UserProgram {
    id: number = 0
    programId: number | null = null
    userId: string = ""
    isMovie: boolean = true
    date: string = ""
    program: Program = new Program({})

    constructor(up: {
        id?: number,
        programId?: number | null,
        userId?: string,
        isMovie?: boolean,
        date?: string,
        program?: Program | null
    }) {
        this.id = up.id ?? 0
        this.programId = up.programId ?? null
        this.userId = up.userId ?? ""
        this.isMovie = up.isMovie ?? true
        this.date = up.date ?? ""
        this.program = up.program ?? new Program({})
    }
}
