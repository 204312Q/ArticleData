// ----------------------------------------------------------------------
// Which system fulfils checkout orders. BC is temporarily off-wired while
// production Business Central is not ready — CT Backend stands in for it.
//
//   ORDER_BACKEND=ctbackend (default) → payments + orders go to CT Backend
//                                       (dev_ctbackend); no BC calls at all.
//   ORDER_BACKEND=bc                  → original flow: BC customer + order
//                                       creation, local dev_confinement mirror.
//
// The BC code paths are kept intact behind this flag so re-enabling BC later
// is a one-line env change, not a code revert.

export type OrderBackend = "bc" | "ctbackend"

export function orderBackend(): OrderBackend {
  return process.env.ORDER_BACKEND?.trim().toLowerCase() === "bc" ? "bc" : "ctbackend"
}
