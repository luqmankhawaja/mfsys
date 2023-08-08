import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators, FormArray, FormControlName } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css']
})
export class ReleaseComponent implements OnInit {
  showTable=false;
  isFilterData=false;
  populateTable=false;
  showCard=false;
  showFilter=false;
  showForm=false;
  selectedOption!: string;
  selectedVersion: string;
  searchNumber:string;
  releaseData:any[]=[];
  filteredData:any[]=[];
  versions:any;
  statusOptions = [
    { label: 'Select Status', value: '' },
    { label: 'Completed', value: 'completed' },
    { label: 'In-Progress', value: 'inProgress' },
    { label: 'To Do', value: 'Todo' },
  ];
  releaseType=[
    {label:'Select Type', value:''},
    {label:'Script',value:'script'},
    {label:'Store Procedure',value:'storeProcedure'}
  ]


  constructor(private FormBuilder:FormBuilder,private http:HttpClient,private toastr:ToastrService) { }

  releaseForm = new FormGroup({
    releaseType:new FormControl('',[Validators.required]),
    releaseVersion:new FormControl('',[Validators.required]),
    userId:new FormControl('',[Validators.required,Validators.maxLength(30)]),
    bugFixes:new FormControl('',[Validators.required]),
    functionalities:new FormControl('',[Validators.required]),
    description:new FormControl('',[Validators.required]),
    date:new FormControl('',[Validators.required]),
    uploadedFiles: new FormArray([],[Validators.required]),


  });

  registerForm=new FormGroup({

      releaseVersion:new FormControl('',[Validators.required]),
      startDate:new FormControl('',[Validators.required]),
      endDate:new FormControl('',[Validators.required]),
      status:new FormControl('',[Validators.required])

  });

  ngOnInit() {
    this.setOptions();
  }

  addBulletPoint(event: Event): void {
    event.preventDefault();
    const textareaElement = event.target as HTMLTextAreaElement;
    const fieldName = textareaElement.getAttribute('formControlName');

    if (fieldName) {
      const control = this.releaseForm.get(fieldName) as FormControl;
      const currentValue = control.value;
      const newValue = currentValue ? currentValue + ', ' : ', ';
      control.setValue(newValue);
    }
}

  setOptions() {
      this.http.get<any>(`http://localhost:8080/getVersions`)
      .subscribe((response) => {
          console.log(response)
          this.versions = response;
           this.toastr.success('hi');

        },
        (error) => {
          this.toastr.warning('Please enter valid data');

        }
      );

  }
  onSave(){
    this.showForm=!this.showForm
    this.releaseForm.patchValue({

      releaseVersion: this.registerForm.get('releaseVersion').value
    });
  }
  regVersion(){

    console.log(this.selectedVersion)
    console.log(this.registerForm)
    this.http.post<any>('http://localhost:8080/registerRelease/body', this.registerForm.value).subscribe(
      (response) => {
        console.log('Registered successfully');
        this.toastr.success('uploaded Successfully')
        this.registerForm.reset();
      },
      (error) => {
        console.error('Error occurred:', error);
      });

  }
  onFileUpload(event: Event) {
    const inputFiles = (event.target as HTMLInputElement).files;
    if (inputFiles && inputFiles.length > 0) {
      const allowedExtensions = [".txt", ".sql"];

      for (let i = 0; i < inputFiles.length; i++) {
        const file = inputFiles[i];
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        if (!allowedExtensions.includes(`.${fileExtension}`)) {
          return;
        }

        const control = new FormControl(file);
        (this.releaseForm.get('uploadedFiles') as FormArray).push(control);
      }
    }
  }
  filterData(){
    if(this.searchNumber.length > 0){
      this.filteredData=this.releaseData.filter((item:{ releaseVersion: string} ) => item.releaseVersion===this.searchNumber)
    }else
    this.filteredData=this.releaseData;
    }

  submitForm() {

      const formData = new FormData();

      const valueObj = {
        type: this.releaseForm.get('releaseType').value || '',
        releaseVersion: this.releaseForm.get('releaseVersion').value || '',
        userName: this.releaseForm.get('userId').value || '',
        bugFixes: this.releaseForm.get('bugFixes').value || '',
        functionalities: this.releaseForm.get('functionalities').value || '',
        description: this.releaseForm.get('description').value || '',
        date: this.releaseForm.get('date').value || '',
      };

      formData.append('value', JSON.stringify(valueObj));

    const files: FileList | null = this.releaseForm.get('uploadedFiles').value;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        formData.append('body', file);
      }
    }
      this.http.post<any>(`http://localhost:8080/saveVersion`, formData).subscribe(
        (response) => {

          console.log('Request successful');
          this.toastr.success('Uploaded Successfully');
          this.releaseForm.reset();
          this.showForm=!this.showForm
        },
        (error) => {
          console.error('Error occurred:', error);
        }
      );


  }

  releaseTable(){
    this.showTable = !this.showTable;

    this.http.get<any>(`http://localhost:8080/viewAllLatestVersion`)
      .subscribe(
        (response) => {

          console.log(response)
          this.releaseData=response;
          this.filteredData=response;




        },
        (error) => {
          this.toastr.warning('Please enter valid data');

        }
      );
  }
  download(selected: any) {
    this.http.get(`http://localhost:8080/download/${selected.releaseVersion}`, {responseType: 'blob'}).subscribe(
        (response: Blob) => {
          console.log('Script Generated');
          this.toastr.success('Script Generated Successfully');

          // Create a temporary link to download the file
          const url = window.URL.createObjectURL(response);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'response.zip';
          a.click();

          // Clean up the temporary link
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error generating script:', error);
          this.toastr.error('Error generating script');
        }
      );
  }
}


