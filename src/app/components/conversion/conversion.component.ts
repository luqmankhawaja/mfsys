import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.css']
})
export class ConversionComponent {
  excelData: any[][][] = [];
  public files: File[] = [];
  public currentPageIndex: number = 0;

  onFileDropped(event: any) {
    this.files = event.dataTransfer.files;
    this.processFiles();
  }

  onFilesSelected(event: any): void {
    this.files = event.target.files;
    this.processFiles();
  }

  onJSONFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const jsonData = JSON.parse(e.target.result);
        const excelData = this.convertJSONToExcelData(jsonData);
        this.excelData.push([excelData]);
      };
      fileReader.readAsText(file);
    }
  }

  goToPage(pageIndex: number): void {
    this.currentPageIndex = pageIndex;
  }

  saveAsJSON(): void {
    const jsonContent = JSON.stringify(this.excelData[this.currentPageIndex][0]);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const fileName = this.files[this.currentPageIndex].name.replace('.xlsx', '.json');
    saveAs(blob, fileName);
  }

  saveAsExcel(): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelData[this.currentPageIndex][0]);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = this.files[this.currentPageIndex].name.replace('.json', '.xlsx');
    saveAs(data, fileName);
  }


  convertJSONToExcelData(jsonData: any): any[][] {
    const excelData: any[][] = [];
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        const value = jsonData[key];
        excelData.push([key, value]);
      }
    }
    return excelData;
  }

  processFiles() {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetsData: any[][] = [];
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          sheetsData.push(jsonData);
        });
        this.excelData.push(sheetsData);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }
}
