import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.css']
})
export class ConversionComponent {
  tableHeaders: string[] = [];
  tableData: any[][][] = [];
  files: File[] = [];
  currentPageIndex: number = 0;

  onFilesSelected(event: any): void {
    this.files = event.target.files;
    this.tableData = [];
    this.processFiles();
  }

  processFiles() {
    this.tableData = [];
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const jsonData = this.processExcelData(workbook);
        this.tableData.push(jsonData);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  processExcelData(workbook: XLSX.WorkBook): any[][] {
    const firstSheetName = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
    this.tableHeaders = jsonData[0]; // Assuming headers are same for all sheets
    return jsonData.slice(1);
  }

  getPageIndices(): number[] {
    return Array.from({ length: this.files.length }, (_, i) => i);
  }

  goToPage(pageIndex: number): void {
    this.currentPageIndex = pageIndex;
  }

  saveAsExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([this.tableHeaders, ...this.tableData[this.currentPageIndex]]);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = this.files[this.currentPageIndex].name.replace('.json', '.xlsx');
    saveAs(data, fileName);
  }

  saveAsJSON(): void {
    const jsonData = this.convertExcelToJSONData(this.tableData[this.currentPageIndex]);
    const jsonContent = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const fileName = this.files[this.currentPageIndex].name.replace('.xlsx', '.json');
    saveAs(blob, fileName);
  }

  convertExcelToJSONData(data: any[][]): any {
    const jsonData: any = {};
    data.forEach((row) => {
      jsonData[row[0]] = row[1];
    });
    return jsonData;
  }
}
