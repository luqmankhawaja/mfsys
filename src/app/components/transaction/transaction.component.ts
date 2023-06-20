import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormBuilder, NgModel } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ProductService } from 'src/app/services/product-service.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})

export class TransactionComponent implements OnInit {
  showTable=false;
  showTransaction=false;
  formData: any = {};
  searchNumber!: 'varchar';
  filteredData: any[] = [];
  transactions: any[]=[];
  updatedTrans:any[]=[];
  selectedOption:string;

  constructor(private productService:ProductService,
    private toastr:ToastrService,
    private http:HttpClient,
    private FormBuilder:FormBuilder
    ) { }

  ngOnInit(): void {
  }


  transTable(){
  this.showTable=!this.showTable;
  this.http.get<any>('http://localhost:3000/transactions')
  .subscribe((response) =>  {
    this.transactions=response;
    this.filteredData=response;
  });
   //this.filteredData = this.data;
  }
filterData() {

    if(this.searchNumber!== null){
      this.filteredData = this.transactions.filter(item => item.ptr_trancode === this.searchNumber);
  }
    else{
     this.filteredData=this.transactions
    }
  }



  transData:any[]=[
    { por_orgacode:'',ptr_trancode:'',pet_eventcode:'',ptr_trandesc:'',systemgen:''}

  ]

addTrans(form:NgForm){
  this.showTransaction=!this.showTransaction;

}


submitForm(myForm:NgForm) {
  // Assuming you have a server endpoint at 'http://example.com/add-data' to handle data storage
  const url = 'http://localhost:3000/transactions';

  this.http.post(url,this.transData[0]).subscribe(
    response => {
      console.log('Form data added successfully');
      this.toastr.success('Transaction Added Successfully');
      // Additional logic after successful data addition
    },
    error => {
      this.toastr.warning('Please enter valid data');
      // Additional error handling logic
    }
  );

  myForm.reset();
}
delTrans(id:any) {
  return this.http.delete('http://localhost:3000/transactions/'+id).subscribe(
    response=>{
      console.log('Transaction Deleted Successfully');
      this.toastr.success(' Transaction Deleted Successfully');
    },
  );


}
toggleEditing(item: any): void {
  item.editing = !item.editing;

  if (!item.editing) {
    // Reset the input field or perform any necessary actions
    this.updatedTrans[item.id] = undefined;
  }
}
updateTrans(){

}
}

