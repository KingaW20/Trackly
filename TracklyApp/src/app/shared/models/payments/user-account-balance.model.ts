import { Payment } from "./payment.model";

export class UserAccountBalance {
    paymentMethodName: string = ""
    startSum: number = 0
    endSum: number = 0
    balance: number = 0
    payments: Payment[] = []

    constructor(b: {
        paymentMethodName?: string,
        startSum?: number,
        endSum?: number,
        balance?: number,
        payments?: Payment[]
    }) {
        this.paymentMethodName = b.paymentMethodName ?? ""
        this.startSum = b.startSum ?? 0
        this.endSum = b.endSum ?? 0
        this.balance = b.balance ?? 0
        this.payments = Object.assign({}, b.payments)
    }
}
