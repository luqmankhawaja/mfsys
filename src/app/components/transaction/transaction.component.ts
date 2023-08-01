import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';
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
  showEditPopup=false;
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
  selectedRows:any[]=[];
  selectedOption:string;

  constructor(private productService:ProductService,
    private toastr:ToastrService,
    private http:HttpClient,
    private FormBuilder:FormBuilder
    ) { }

  ngOnInit(): void {
  }

  transForm=new FormGroup({
    porOrgaCode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    ptrTranCode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    petEventCode:new FormControl('',[Validators.required]),
    ptrTranDesc:new FormControl('',[Validators.required,Validators.maxLength(40)]),
    systemGeneratederated:new FormControl('',[Validators.required,Validators.maxLength(1)]),
  })

//          Table For Selected Data


transTable(){
  this.showTable=!this.showTable;
  if(this.selectedOption=='generalledger'|| this.selectedOption=='loan'||this.selectedOption=='deposit'){

  this.http.get<any>(`http://localhost:8080/${this.selectedOption}/transaction/view`)
  .subscribe((response) =>  {
    this.transactions=response;
    this.filteredData=response;
  });
  }
}
filterData() {

    if(this.searchNumber!== null){
      this.filteredData = this.transactions.filter((item:{ transId:{ ptrTranCode: string}; }) => item.transId.ptrTranCode=== this.searchNumber);
  }
    else{
     this.filteredData=this.transactions
    }
  }


                    //      Data of All Transaction

populateTable(){
  this.allTransTable=!this.allTransTable;
  this.http.get<any>(`http://localhost:8080/viewAll/transaction`).subscribe((response)=>{
    this.allTransactions=response;
    this.dataFilteration=response;

  })

}
filteration(){
  if(this.filterationNumber.length>0)
    this.dataFilteration=this.allTransactions.filter((item:{ transId:{ ptrTranCode: string}; }) => item.transId.ptrTranCode===this.filterationNumber)
  else
    this.dataFilteration=this.allTransactions
}

submitForm(transForm) {

  const url = `http://localhost:8080/${this.selectedOption}/transaction/add/body`;

const  payload={

    "transId": {
      "porOrgaCode": transForm.get('porOrgaCode').value || '',
      "ptrTranCode": transForm.get('ptrTranCode').value || '',
      "dbName": this.selectedOption
  },
  "petEventCode": transForm.get('petEventCode').value || '',
  "ptrTranDesc": transForm.get('ptrTranDesc').value || '',
  "systemGeneratederated":transForm.get('systemGenerated').value || ''

}

    console.log(payload);
    console.log(this.selectedOption)
  if(transForm.valid){
    this.http.post(url , payload).subscribe(
      response => {
        this.toastr.success("Transaction_Type added succesfully");
        transForm.reset();
  },
  (error: any) => {
    if(error){
      this.toastr.error("error");
      console.log(error)
    }
  }
    );
  }

}

editTrans(item: any){
  this.showEditPopup=!this.showEditPopup;
  this.updateBtn=!this.updateBtn;
  this.hideBtn=!this.hideBtn;
  this.selectedTrans = item;
  this.transForm.patchValue({
  porOrgaCode: item.tranId.porOrgaCode,
  ptrTranCode: item.tranId.ptrTranCode,
  petEventCode: item.petEventCode,
  ptrTranDesc: item.ptrTranDesc,
  systemGenerated: item.systemGenerated
});
}
closePopup() {
  this.showEditPopup=false;
  this.transForm.reset();
}

delTrans(selected:any) {
  console.log(selected);
        const requestBody=[
          {
          porOrgaCode:selected.porOrgaCode,
          ptrTranCode:selected.ptrTranCode,
          dbName:this.selectedOption
          }
        ]
          return this.http.delete(`http://localhost:8080/${this.selectedOption}/transaction/delete/requestBody`, {body:requestBody}).subscribe(
            response=>{
              console.log('Transaction_Type Deleted Successfully');
              this.toastr.success(' Transaction_Type Deleted Successfully');
            },
          );


}
updateSelectedRows(item: any) {

  if (item.selected) {
  this.selectedRows.push(item);
  } else {
  const index = this.selectedRows.findIndex((selectedItem) => selectedItem.porOrgaCode === item.porOrgaCode && selectedItem.ptrTranCode === item.ptrTranCode);
    if (index !== -1) {
      this.selectedRows.splice(index, 1);
  }
}
}
delMultipleTrans() {
  console.log(this.selectedRows);

  const payload = this.selectedRows.map((selectedItem) => {
    return {

        porOrgaCode:selectedItem.tranId.porOrgaCode,
        ptrTranCode:selectedItem.tranId.ptrTranCode,
        dbName:this.selectedOption


    };
  });
  return this.http
    .delete(`http://http://localhost:8080/${this.selectedOption}/transaction/deleteAll/requestBody`, { body: payload })
    .subscribe(
      () => {
        console.log('Selected rows deleted successfully');
        this.toastr.success('Selected rows deleted successfully');
      },
      (error) => {
        console.error('Failed to delete selected rows:', error);
      }
    );
  }


  updateTrans(event:Event,transForm ) {
    event.preventDefault();
    const url = `http://localhost:8080/${this.selectedOption}/transaction/update/body`;
    const body = {
      "transId": {
        "porOrgaCode": transForm.get('porOrgaCode').value || '',
        "ptrTranCode": transForm.get('ptrTranCode').value || '',
        "dbName": this.selectedOption
    },
    "petEventCode": transForm.get('petEventCode').value || '',
    "ptrTranDesc": transForm.get('ptrTranDesc').value || '',
    "systemGeneratederated":transForm.get('systemGenerated').value || ''
    }
    console.log(body);
    console.log(this.selectedOption)
    if(transForm.valid){
        this.http.put(url,body).subscribe(
          response => {
            console.log(response);
            console.log('Transaction_type Updated successfully');
              this.toastr.success('Transaction_type Updated successfully');
              transForm.reset();
              this.showEditPopup=false;
            },
            error => {
              this.toastr.warning('Error updating form data');
            }
          );
    }
  }
  genScript(selected:any){

    const requestBody = {
        tranId:{
          porOrgaCode: selected.tranId.porOrgaCode,
          ptrTranCode: selected.tranId.ptrTranCode
        },
          petEventCode: selected.petEventCode,
          ptrTranDesc: selected.ptrTranDesc,
          systemGenerated: selected.systemGenerated,


      };
      console.log(requestBody);

      this.http
        .post(`http://localhost:8080/${this.selectedOption}/transaction/generateScript/requestBody`,requestBody,{ responseType: 'text' }).subscribe(
          (response) => {
            alert(response);
            console.log('Script Generated');
            this.toastr.success('Script Generated Successfully');
            const blob = new Blob([JSON.stringify(response)], {
              type: 'application/txt',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'response.txt';
            a.click();

            window.URL.revokeObjectURL(url);
          },
          (error) => {

            console.error('Error generating script:', error);
            this.toastr.error('Error generating script');
          }
        );
    }

}

