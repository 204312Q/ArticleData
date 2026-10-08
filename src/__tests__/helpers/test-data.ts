export const validCreateOrderBody = {
  sellToCustomerNo: "C0001",
  externalDocumentNo: "WEB-ORDER-0001",
  dateType: "EDD",
  eddDate: "2026-05-01",
};

export const existingOrderRecord = {
  orderNo: "SO-1001",
  externalDocumentNo: "WEB-ORDER-0001",
  dateType: "EDD",
  eddDate: "2026-05-01",
};

export const createdOrderRecord = {
  orderNo: "SO-1002",
  externalDocumentNo: "WEB-ORDER-0002",
  dateType: "EDD",
  eddDate: "2026-05-02",
};

export const validLineRequestBody = {
  line: {
    itemNo: "ITEM-001",
    quantity: 2,
    description: "Sample line",
  },
};

export const orderLines = [
  {
    orderNo: "SO-1001",
    salesLineNo: 10000,
    itemNo: "ITEM-001",
    description: "Sample line",
    quantity: 2,
    unitPrice: 10,
  },
];
