import assert from "node:assert/strict";
import test from "node:test";
import { createDataGridColumns } from "./json.ts";

test("AG Grid 형태의 JSON columnDefs를 DataGrid 컬럼으로 변환한다", () => {
  const columns = createDataGridColumns([
    { field: "company", headerName: "업체", width: 160 },
    {
      field: "saleAmount",
      headerName: "판매가",
      orderBy: "sale.amount",
      pinned: "right",
      type: "number",
      excelFormat: "#,##0",
      width: 88,
    },
  ] as const);

  assert.deepEqual(
    columns.map(
      ({
        accessor,
        align,
        excelFormat,
        fixed,
        header,
        id,
        orderBy,
        width,
      }) => ({
        accessor,
        align,
        excelFormat,
        fixed,
        header,
        id,
        orderBy,
        width,
      }),
    ),
    [
      {
        accessor: "company",
        align: undefined,
        excelFormat: undefined,
        fixed: undefined,
        header: "업체",
        id: "company",
        orderBy: "company",
        width: "160px",
      },
      {
        accessor: "saleAmount",
        align: "right",
        excelFormat: "#,##0",
        fixed: "right",
        header: "판매가",
        id: "saleAmount",
        orderBy: "sale.amount",
        width: "88px",
      },
    ],
  );
});
