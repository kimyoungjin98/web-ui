import { read } from "xlsx";
import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadDataGridAsExcel } from "./export";

describe("downloadDataGridAsExcel", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("downloads a valid XLSX workbook containing the grid data", async () => {
    let downloadedBlob: Blob | undefined;
    vi.stubGlobal("URL", {
      createObjectURL: (blob: Blob) => {
        downloadedBlob = blob;
        return "blob:slots";
      },
      revokeObjectURL: vi.fn(),
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      () => undefined,
    );

    await downloadDataGridAsExcel({
      columns: [
        { id: "id", header: "번호", accessor: "id" },
        { id: "name", header: "이름", accessor: "name" },
      ],
      rows: [{ id: 42, name: "테스트 슬롯" }],
      filename: "slot-list",
    });

    expect(downloadedBlob).toBeDefined();
    const bytes = new Uint8Array(await downloadedBlob!.arrayBuffer());
    expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);

    const workbook = read(bytes, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]!];

    expect(sheet.A1.v).toBe("번호");
    expect(sheet.B2.v).toBe("테스트 슬롯");
  });
});
