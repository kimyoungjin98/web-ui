import { read } from "xlsx";
import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadDataGridAsExcel } from "./export";

describe("downloadDataGridAsExcel", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("downloads a valid XLSX workbook containing typed grid data", async () => {
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
        { id: "id", header: "번호", accessor: "id", type: "number" },
        { id: "name", header: "이름", accessor: "name" },
        {
          id: "active",
          header: "활성",
          accessor: "active",
          type: "boolean",
        },
        {
          id: "createdAt",
          header: "생성일",
          accessor: "createdAt",
          type: "date",
          excelFormat: "yyyy-mm-dd hh:mm",
          width: "170px",
        },
        {
          id: "code",
          header: "코드",
          accessor: "code",
          type: "text",
        },
      ],
      rows: [
        {
          id: 42,
          name: "테스트 슬롯",
          active: true,
          createdAt: "2026-08-18T12:30:00.000Z",
          code: "00123",
        },
      ],
      filename: "slot-list",
    });

    expect(downloadedBlob).toBeDefined();
    const bytes = new Uint8Array(await downloadedBlob!.arrayBuffer());
    expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);

    const workbook = read(bytes, {
      type: "array",
      cellDates: true,
      cellNF: true,
      cellStyles: true,
    });
    const sheet = workbook.Sheets[workbook.SheetNames[0]!];

    expect(sheet.A1.v).toBe("번호");
    expect(sheet.A2).toMatchObject({ t: "n", v: 42 });
    expect(sheet.B2.v).toBe("테스트 슬롯");
    expect(sheet.C2).toMatchObject({ t: "b", v: true });
    expect(sheet.D2.t).toBe("d");
    expect(sheet.D2.v).toBeInstanceOf(Date);
    expect(sheet.D2.z).toBe("yyyy-mm-dd hh:mm");
    expect(sheet["!cols"]?.[3]?.wpx).toBeGreaterThanOrEqual(170);
    expect(sheet.E2).toMatchObject({ t: "s", v: "00123" });
  });
});
