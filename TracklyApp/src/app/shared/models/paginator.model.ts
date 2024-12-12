export class Paginator {
    currentPage : number = 1
    pageItemNumber : number = 8
    totalPages : number = 1
    pagesNumberShown : number = 5
    pages : number[] = [ 1 ]

    getListPart(list: any[]) : any[] {        
        return list.slice((this.currentPage - 1)*this.pageItemNumber, this.currentPage*this.pageItemNumber)
    }

    updatePaginatorInfo(list: any[]) {
        this.totalPages = Math.ceil(list.length / this.pageItemNumber)
        if (this.totalPages == 0) this.totalPages = 1
    
        this.pages = []
        if (this.currentPage > this.totalPages)
            this.currentPage = this.totalPages
        
        let pageToAdd = Math.min(
            this.currentPage - (this.pagesNumberShown - 1) / 2,
            this.totalPages - this.pagesNumberShown + 1
        )
        while(this.pages.length < this.pagesNumberShown && this.pages.length < this.totalPages) {
            if (pageToAdd >= 1 && pageToAdd <= this.totalPages)
                this.pages.push(pageToAdd)
            pageToAdd += 1
        }

        this.pages.sort((a, b) => a - b);
    }
}
