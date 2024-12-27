export class Paginator {
    currentPage : number = 1
    pageItemNumber : number = 8
    totalPages : number = 1
    pagesNumberShown : number = 5
    pages : number[] = [ 1 ]

    constructor(p: {
        currentPage?: number,
        pageItemNumber?: number,
        totalPages?: number,
        pagesNumberShown?: number,
        pages?: number[],
    }) {
        this.currentPage = p.currentPage ?? 1;
        this.pageItemNumber = p.pageItemNumber ?? 8;
        this.totalPages = p.totalPages ?? 1;
        this.pagesNumberShown = p.pagesNumberShown ?? 5;
        this.pages = p.pages ?? [ 1 ];
    }

    getListPart(list: any[]) : any[] {        
        return list.slice((this.currentPage - 1)*this.pageItemNumber, this.currentPage*this.pageItemNumber)
    }

    updatePaginatorInfo(listLength: number) {
        this.totalPages = Math.ceil(listLength / this.pageItemNumber)
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

    changePagesShown(previous: boolean) {
        if (previous)
        {
            let firstPage = this.pages[0]
            this.pages.pop()
            this.pages.push(firstPage - 1)
            this.pages.sort((a, b) => a - b);
        }
        else
        {
            let lastPage = this.pages[this.pages.length - 1]
            this.pages.shift()    // removing first page
            this.pages.push(lastPage + 1)
            this.pages.sort((a, b) => a - b);
        }
    }
    
    canShowPage(previous: boolean) {
        if (previous)
            return this.pages[0] <= 1
        else
            return this.pages[this.pages.length - 1] >= this.totalPages
    }
}
