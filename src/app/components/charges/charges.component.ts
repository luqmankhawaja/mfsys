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
  this.filteredData=[]
  this.filteredData = this.charges.filter((item: { pch_chrgcode: string; }) => item.pch_chrgcode === this.searchNumber);
}

chargeData:any[]=[
  {pch_chrgcode:'',por_orgacode:'',pch_chrgdesc:'',pch_chrgshort:'',pel_elmtcode:'',ptr_trancode:'',pch_chrgprofit:'',soc_charges:'',active:''}
]
addCharges(form:NgForm){
  this.showCharges=!this.showCharges;

}
submitForm(myForm: NgForm) {
  // Assuming you have a server endpoint at 'http://example.com/add-data' to handle data storage
  const url = 'http://localhost:3000/charges';

  this.http.post(url,this.chargeData[0]).subscribe(
    response => {
      console.log('Form data added successfully');
      this.toastr.success('Charge Added Successfully');

      // Additional logic after successful data addition
    },
    error => {
      this.toastr.warning('Please enter valid data');
      // Additional error handling logic
    }
  );
    myForm.reset();
}
toggleEditing(item: any): void {
  item.editing = !item.editing;

  if (!item.editing) {
    // Reset the input field or perform any necessary actions
    this.updatedCharge[item.id] = undefined;
  }
}
updateCharge(){

}
}
