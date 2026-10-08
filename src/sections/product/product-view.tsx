import type { ProductCatalog } from './product-data';

import { ProductOrderFlow } from './product-order-flow';

// ----------------------------------------------------------------------

type ProductViewProps = {
  productCatalog: ProductCatalog;
};

export function ProductView({ productCatalog }: ProductViewProps) {
  return <ProductOrderFlow productCatalog={productCatalog} />;
}
