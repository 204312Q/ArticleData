// Manual Order model types until prisma generate works
// This mirrors the Prisma schema definition

export type Order = {
  id: string
  orderNo: string
  externalDocumentNo: string
  customerNo: string
  dateType: string
  orderSource: string | null
  paymentTransactionId: string | null
  createdAt: Date
  updatedAt: Date
}

export type OrderCreateInput = {
  id?: string
  orderNo: string
  externalDocumentNo: string
  customerNo: string
  dateType: string
  orderSource?: string | null
  paymentTransactionId?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type OrderUpsertInput = {
  where: { orderNo: string }
  create: OrderCreateInput
  update: Partial<Omit<OrderCreateInput, 'id'>>
}
