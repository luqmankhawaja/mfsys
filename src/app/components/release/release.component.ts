import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
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
  releaseData:any[]=[];
  newData:any[]=[];
  versions:any;


  constructor(private FormBuilder:FormBuilder,private http:HttpClient,private toastr:ToastrService) { }

  releaseForm = new FormGroup({
    type: new FormControl('',[Validators.required]),
    selectedVersion:new FormControl('',[Validators.required]),
    userId:new FormControl('',[Validators.required,Validators.maxLength(30)]),
    date:new FormControl('',[Validators.required]),
    uploadedFiles: new FormArray([]),


  });

  ngOnInit() {
    this.setOptions();
  }

  setOptions() {
      this.http.get<any>(`http://192.168.1.67:8080/getVersions`)
      .subscribe((response) => {
          console.log(response)
          this.versions = response;
           this.toastr.success('hi');

        },
        (error) => {
          // this.toastr.warning('Please enter valid data');

        }
      );

  }
  onSave(){
    this.showForm=!this.showForm
    this.releaseForm.patchValue({
      type:this.selectedOption,
      selectedVersion:this.selectedVersion
    });
  }
  regVersion(){
    console.log(this.selectedVersion)
    const newVersion= this.selectedVersion;
    const requestBody={releaseVersion:newVersion}
    this.http.post<any>(`http://192.168.1.67:8080/registerRelease/body`,requestBody).subscribe(
      (response) => {

        console.log(response)
        this.toastr.success('Release Registered successfully');

      },
      (error) => {
        this.toastr.warning('Please enter valid data');

      }
    );
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
    console.log(this.selectedVersion)
    this.http.get<any>(`http://192.168.1.67:8080/view/${this.selectedVersion}`)
    .subscribe((response) => {

        console.log(response);
        this.showTable=true;
        this.isFilterData=true;
        this.newData=[response];


    },
    (error) => {
      alert("No data Found");
      this.populateTable = false;
    }
  );
  }

  submitForm() {
    const formData = new FormData();

    const valueObj = {
      release_version: this.releaseForm.get('selectedVersion').value || '',
      user_name: this.releaseForm.get('userId').value || '',
      type: this.releaseForm.get('type').value || '',
      date: this.releaseForm.get('date').value || '',
    };

    formData.append('value', JSON.stringify(valueObj));

    // Append each selected file to the FormData
    for (const file of this.releaseForm.get('uploadedFiles').value) {
      formData.append('body', file, file.name);
    }
    console.log(formData);
    // Make sure to replace 'YOUR_BACKEND_ENDPOINT' with the actual backend URL
    this.http.post('http://192.168.1.67:8080/saveVersion', formData).subscribe(
      (response) => {
        // Handle success response, if needed
        console.log('Request successful:', response);
        this.toastr.success('uploaded Successfully')
      },
      (error) => {
        // Handle error, if needed
        console.error('Error occurred:', error);
      }
    );
  }

  releaseTable(){
    this.showTable = true;
    this.isFilterData=false;
    this.http.get<any>(`http://192.168.1.67:8080/viewAllLatestVersion`)
      .subscribe(
        (response) => {

          console.log(response)
          this.releaseData=response;




        },
        (error) => {
          // this.toastr.warning('Please enter valid data');

        }
      );
  }
  download(selected: any) {
    this.http.get(`http://192.168.1.67:8080/download/${selected.releaseVersion}`, {responseType: 'blob'}).subscribe(
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


