import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormBuilder, NgModel,FormGroup,FormControl,Validators } from '@angular/forms';
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
  allTransTable=false;
  hideBtn=true;
  updateBtn=false;
  selectedTrans:any;
  formData: any = {};
  searchNumber!: 'varchar';
  filterationNumber!:'varchar';
  filteredData: any[] = [];
  transactions: any[]=[];
  dataFilteration:any[]=[];
  allTransactions:any[]=[];
  selectedOption:string;

  constructor(private productService:ProductService,
    private toastr:ToastrService,
    private http:HttpClient,
    private FormBuilder:FormBuilder
    ) { }

  ngOnInit(): void {
  }

  transForm=new FormGroup({
    por_orgacode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    ptr_trancode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    pet_eventcode:new FormControl('',[Validators.required]),
    ptr_trandesc:new FormControl('',[Validators.required,Validators.maxLength(40)]),
    systemgen:new FormControl('',[Validators.required,Validators.maxLength(1)]),
  })

//          Table For Selected Data


transTable(){
  this.showTable=!this.showTable;
  if(this.selectedOption=='generalledger'|| this.selectedOption=='loan'||this.selectedOption=='deposit'){

  this.http.get<any>(`http://192.168.1.51:8080/getData/transaction_type/${this.selectedOption}`)
  .subscribe((response) =>  {
    this.transactions=response;
    this.filteredData=response;
  });
  }
}
filterData() {

    if(this.searchNumber!== null){
      this.filteredData = this.transactions.filter(item => item.ptr_trancode === this.searchNumber);
  }
    else{
     this.filteredData=this.transactions
    }
  }


                    //      Data of All Transaction

populateTable(){
  this.allTransTable=!this.allTransTable;
  this.http.get<any>(`http://192.168.1.51:8080/getData/transaction_type/all`).subscribe((response)=>{
    this.allTransactions=response;
    this.dataFilteration=response;

  })

}
filteration(){
  if(this.filterationNumber.length>0)
    this.dataFilteration=this.allTransactions.filter(item=>item.ptr_trancode===this.filterationNumber)
  else
    this.dataFilteration=this.allTransactions
}

submitForm(transForm) {
  const url = `http://192.168.1.51:8080/addcolumns/${this.selectedOption}/transaction_type/body`;
    const body = JSON.stringify(this.transForm.value);
    console.log(body);
    console.log(this.selectedOption)
  if(transForm.valid){
    this.http.post(url , body,{responseType:"text"}).subscribe(
      response => {
        if(response.includes("effected")){
        this.toastr.success("Transaction_Type added succesfully");
        transForm.reset();
        }
  },(error: any) => {
    if(error){
      this.toastr.error("error");
      console.log(error)
    }
  }
    );
  }

}

editTrans(item: any){
  this.updateBtn=!this.updateBtn;
  this.hideBtn=!this.hideBtn;
  this.selectedTrans = item;
  this.transForm.patchValue({
  por_orgacode: item.por_orgacode,
  ptr_trancode: item.ptr_trancode,
  pet_eventcode: item.pet_eventcode,
  ptr_trandesc: item.ptr_trandesc,
  systemgen: item.systemgen
});
}

delTrans(selected:any) {
  console.log(selected);
        const requestBody: String = JSON.stringify(selected);
          return this.http.delete(`http://192.168.1.51:8080/delete/${this.selectedOption}/transaction_type/requestBody`, {body:requestBody}).subscribe(
            response=>{
              console.log('Transaction_Type Deleted Successfully');
              this.toastr.success(' Transaction_Type Deleted Successfully');
            },
          );


}
  updateTrans(event:Event,transForm ) {
    event.preventDefault();
    const url = `http://192.168.1.51:8080/update/transactions/${this.selectedOption}/body`;
    const body = JSON.stringify(this.transForm.value);
    console.log(body);
    console.log(this.selectedOption)
    if(transForm.valid){
        this.http.put(url,body,{responseType:"text"}).subscribe(
          response => {
            console.log(response);
            console.log('Transaction_type Updated successfully');
              this.toastr.success('Transaction_type Updated successfully');
            },
            error => {
              this.toastr.warning('Error updating form data');
            }
          );
    }
  }
  genScript(event:MouseEvent, selected:any){
    // event.preventDefault;
    const requestBody: String =JSON.stringify(selected);

    this.http.post(`http://192.168.1.51:8080/generateScript/transactions/${this.selectedOption}/requestBody`,{body:requestBody},{responseType:'text'}).subscribe((response)=>{
      alert(response)
      console.log("Script Generated");
      this.toastr.success('Script Generated Successfully');

    });
 }

}

