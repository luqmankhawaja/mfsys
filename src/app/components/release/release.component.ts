import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css']
})
export class ReleaseComponent implements OnInit {
  showTable=false;
  selectedOption!: string;
  selectedVersion!: string;
  releaseData:any[]=[];
  versions = ["1.0", "2.0", "3.0"];
  options!: string[];

  constructor(private FormBuilder:FormBuilder,private http:HttpClient) { }

  releaseForm = new FormGroup({
    selectedOption: new FormControl('',[Validators.required]),
    selectedVersion:new FormControl('',[Validators.required]),
    userId:new FormControl('',[Validators.required,Validators.maxLength(30)]),
    status:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    uploadedFiles: new FormArray([]),


  });

  ngOnInit() {
    this.setOptions();
  }

  setOptions() {
    setTimeout(() => {
      this.versions = this.options;
    }, 5000)
  }
  onSave(){
    this.releaseForm.patchValue({
      selectedOption:this.selectedOption,
      selectedVersion:this.selectedVersion
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


  onSubmit() {

    console.log(this.releaseForm.value);
  }

  releaseTable(){
    this.showTable=!this.showTable
    this.http.get<any>('http://localhost:3000/release')
      .subscribe(
        (response) => {

          console.log(response)
          this.releaseData=response
          // this.toastr.success('Signup successfully');

        },
        (error) => {
          // this.toastr.warning('Please enter valid data');

        }
      );
  }
}


