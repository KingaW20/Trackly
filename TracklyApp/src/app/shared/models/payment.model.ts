export class Payment {
    id: number
    categoryId: number | null
    userPaymentMethodId: number | null
    description: string
    sum: number | null
    date: string
    isOutcome: boolean
    paymentCategoryName: string
    paymentMethodName: string

    constructor(p: {
        id?: number,
        categoryId?: number | null,
        userPaymentMethodId?: number | null,
        description?: string,
        sum?: number | null,
        date?: string,
        isOutcome?: boolean,
        paymentCategoryName?: string,
        paymentMethodName?: string
    }) {
        this.id = p.id ?? 0
        this.categoryId = p.categoryId ?? null
        this.userPaymentMethodId = p.userPaymentMethodId ?? null
        this.description = p.description ?? ""
        this.sum = p.sum ?? null
        this.date = p.date ?? ""
        this.isOutcome = p.isOutcome ?? true
        this.paymentCategoryName = p.paymentCategoryName ?? ""
        this.paymentMethodName = p.paymentMethodName ?? ""
    }
}