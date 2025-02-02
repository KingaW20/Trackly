import { Payment } from "./payment.model";

export class UserAccountBalance {
    paymentMethodName: string = ""
    startSum: number = 0
    endSum: number = 0
    balance: number = 0
    payments: Payment[] = []
    outcome: Record<string, number> = {}
    income: Record<string, number> = {}

    constructor(b: {
        paymentMethodName?: string,
        startSum?: number,
        endSum?: number,
        balance?: number,
        payments?: Payment[],
        outcome?: {},
        income?: {}
    }) {
        this.paymentMethodName = b.paymentMethodName ?? ""
        this.startSum = b.startSum ?? 0
        this.endSum = b.endSum ?? 0
        this.balance = b.balance ?? 0
        if (b.payments == null) this.payments = []
        else this.payments = JSON.parse(JSON.stringify(b.payments));

        this.outcome = {};
        this.income = {};
        if (this.payments.length > 0) {
            this.payments.forEach(p => {
                if (p.isOutcome) {
                    if (p.paymentCategoryName in this.outcome)
                        this.outcome[p.paymentCategoryName] = this.outcome[p.paymentCategoryName] + (p.sum ?? 0);
                    else
                        this.outcome[p.paymentCategoryName] = (p.sum ?? 0);
                } else {
                    if (p.paymentCategoryName in this.income)
                        this.income[p.paymentCategoryName] = this.income[p.paymentCategoryName] + (p.sum ?? 0);
                    else
                        this.income[p.paymentCategoryName] = (p.sum ?? 0);
                }
            });

            // console.log("income", this.income)
            // console.log("outcome", this.outcome)
        }
    }
}
