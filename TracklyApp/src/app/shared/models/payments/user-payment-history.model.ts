import { UserPaymentMethod } from "./user-payment-method.model"

export class UserPaymentHistory {
    id: number = 0
    userPaymentMethodId: number | null = null
    sum: string = ""
    date: string = ""
    enteredByUser: boolean = false
    userPaymentMethod: UserPaymentMethod | null = null

    constructor(uph: {
        id?: number,
        userPaymentMethodId?: number | null,
        sum?: string,
        date?: string,
        enteredByUser?: boolean,
        userPaymentMethod?: UserPaymentMethod | null
    }) {
        this.id = uph.id ?? 0
        this.userPaymentMethodId = uph.userPaymentMethodId ?? null
        this.sum = uph.sum ?? ""
        this.date = uph.date ?? ""
        this.enteredByUser = uph.enteredByUser ?? false
        this.userPaymentMethod = uph.userPaymentMethod ?? null
    }
}
