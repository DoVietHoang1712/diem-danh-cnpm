import { ObjectID } from "mongodb";
import * as XLSX from "xlsx";
import moment = require("moment");

export class ExportTool {
    static async exportExcel(data: any[], sheetName: string) {
        const wb = XLSX.utils.book_new();
        wb.SheetNames.push(sheetName);
        const ws = XLSX.utils.json_to_sheet(data);
        const cols = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 },
            { wch: 30 },
        ];
        ws["!cols"] = cols;
        wb.Sheets[sheetName] = ws;
        const toDay = moment().format("DD-MM-YYYY_HH:mm");
        const fileName = `${sheetName}_${toDay}.xlsx`;
        const wopts = { bookType: "xlsx", bookSST: false, type: "array" };
        XLSX.writeFile(wb, `./uploads/data/${fileName}`);
        return {
            url: `localhost:{port}/data/${fileName}`,
        };
    }

    static async exportMultiSheetExcel(multiSheetData: [{ data: any[]; sheetName: string }]) {
        const wb = XLSX.utils.book_new();
        multiSheetData.forEach(sheetData => {
            const { sheetName, data } = sheetData;
            wb.SheetNames.push(sheetName);
            const ws = XLSX.utils.json_to_sheet(data);
            const cols = [
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 15 },
                { wch: 15 },
                { wch: 30 },
                { wch: 30 },
            ];
            ws["!cols"] = cols;
            wb.Sheets[sheetName] = ws;
        });
        const fileName = `${new ObjectID()}_${Date.now()}.xlsx`;
        const wopts = { bookType: "xlsx", bookSST: false, type: "array" };
        XLSX.writeFile(wb, `./uploads/data/${fileName}`);
        return {
            url: `localhost:{port}/data/${fileName}`,
        };
    }

    static async exportExcelWithMerge(
        data: any[],
        sheetName: string,
        merges: Array<{
            s: { r: number; c: number };
            e: { r: number; c: number };
        }>,
        colOtps?: Array<{ wch: number }>,
    ) {
        const wb = XLSX.utils.book_new();
        wb.SheetNames.push(sheetName);
        const ws = XLSX.utils.json_to_sheet(data);
        const cols = colOtps || [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 },
            { wch: 30 },
        ];
        ws["!cols"] = cols;
        ws["!merges"] = merges;
        wb.Sheets[sheetName] = ws;
        const fileName = `${sheetName}_${Date.now()}.xlsx`;
        const wopts = { bookType: "xlsx", bookSST: false, type: "array" };
        XLSX.writeFile(wb, `./uploads/data/${fileName}`);
        return {
            url: `localhost:{port}/data/${fileName}`,
        };
    }

    static async exportExcelAdvance(data: any[], sheetName: string, query: string[]) {
        const wb = XLSX.utils.book_new();
        wb.SheetNames.push(sheetName);
        const newData = data.map(value => {
            const c: any[] = [];
            query.forEach(gt => {
                c.push((value as any)[gt]);
            });
            return c;
        });
        const res = newData.map(val => {
            const test = Object.create({});
            let i = 0;
            for (const va of val) {
                (test as any)[query[i]] = va;
                i++;
            }
            return test;
        });
        const ws = XLSX.utils.json_to_sheet(res);
        const cols = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 },
            { wch: 30 },
        ];
        ws["!cols"] = cols;
        wb.Sheets[sheetName] = ws;
        const fileName = `${sheetName}.xlsx`;
        const wopts = { bookType: "xlsx", bookSST: false, type: "array" };
        XLSX.writeFile(wb, `./uploads/data/${fileName}`);
        return {
            url: `localhost:{port}/data/${fileName}`,
        };
    }

    static async exportTemplateExcel(filename: string, objArr: object[]): Promise<{ url: string }> {
        const wb = XLSX.utils.book_new();
        wb.SheetNames.push("Data");
        const ws = XLSX.utils.json_to_sheet(objArr);
        ws["!cols"] = Object.keys(objArr[0]).map(() => ({ wch: 20 }));
        wb.Sheets.Data = ws;
        XLSX.writeFile(wb, `./uploads/data/${filename}.xlsx`);
        return {
            url: `localhost:{port}/data/${filename}.xlsx`,
        };
    }
}
