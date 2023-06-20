import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormBuilder, NgModel, FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ProductService } from 'src/app/services/product-service.service';
import { BrowserModule } from '@angular/platform-browser';



@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.css']
})
export class ChargesComponent implements OnInit {
  showTable=false;
  showCharges=false;
  formData: any[] = [];
  searchNumber!: 'varchar';
  filteredData: any[] = [];
  charges: any[]=[];
  updatedCharge:any[]=[];
  selectedOption:string;




  constructor(private productService:ProductService,
    private toastr:ToastrService,
    private http:HttpClient,
    private FormBuilder:FormBuilder) { }

  ngOnInit(): void {

  }


chargesTable(){
  this.showTable=!this.showTable;
  this.http.get<any>('http://localhost:3000/charges')
  .subscribe((response) =>  {
    this.charges=response;
    this.filteredData=response;
  });
   //this.filteredData = this.data;

}

filterData() {
if(this.searchNumber.length>0){
  this.filteredData = this.charges.filter((item: { pch_chrgcode: string; }) => item.pch_chrgcode === this.searchNumber);
}
else{
  this.filteredData=this.charges
}
 }

chargeData:any[]=[
  {pch_chrgcode:'',por_orgacode:'',pch_chrgdesc:'',pch_chrgshort:'',pel_elmtcode:'',ptr_trancode:'',pch_chrgprofit:'',soc_charges:'',active:''}
]
addCharges(form:NgForm){
  this.showCharges=!this.showCharges;

}
submitForm(myForm: NgForm) {
  if (myForm.valid) {
    const url = 'http://localhost:3000/charges';

    this.http.post(url, this.chargeData[0]).subscribe(
      response => {
        console.log('Form data added successfully');
        this.toastr.success('Form Submitted Successfully');

        // Additional logic after successful data addition
      },
      error => {
        this.toastr.warning('Error occurred while submitting form');
      }
    );
  } else {
    this.toastr.warning('Please enter valid data');
  }

  myForm.reset();
}
delCharge(id:any) {
  return this.http.delete('http://localhost:3000/charges/'+id).subscribe(
    response=>{
      console.log('Charge Deleted Successfully')
      this.toastr.success('Charge Deleted Successfully')
    },
  );

}

toggleEditing(item: any): void {
  item.editing = !item.editing;

  if (!item.editing) {
    // Reset the input field or perform any necessary actions
    this.updatedCharge[item.id] = undefined;
  }
}
updateCharge( id: number, editedValue: number): void{
  const index = this.charges.findIndex(data => data.id === id);

    if (index !== -1) {
      const existingValue = this.charges[index].value;

      if (editedValue !== existingValue) {
        // Update the existing value
        this.charges[index].value = editedValue;

        // Send the update request to the API
        const updatedData = {
          id: id,
          value: editedValue
        };

        this.http.put('http://localhost:3000/charges/', updatedData)
          .subscribe(
            () => {
              console.log('Update successful!');
            },
            error => {
              console.error('Error occurred during update:', error);
              // You can handle the error as needed
              // For example, revert the value back to the existing value
              this.charges[index].value = existingValue;
            }
          );
      } else {
        console.log('No changes detected.');
      }
    } else {
      console.error('Charge data with specified ID not found.');
    }
  }

}

