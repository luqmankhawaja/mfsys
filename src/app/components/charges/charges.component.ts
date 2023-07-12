import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormBuilder, NgModel,FormControl,Validators, FormsModule, FormGroup } from '@angular/forms';
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
  updateBtn=false;
  showTable=false;
  showCharges=false;
  chrgTable=false;
  hideBtn=true;
  formData: any[] = [];
  searchNumber!: 'varchar';
  filteredData: any[] = [];
  dataFilteration:any[]=[];
  selectedRows:any[]=[];
  charges: any[]=[];
  selectedCharge:any;
  allCharges:any[]=[];
  updatedCharge:any[]=[];
  selectedOption:string;
  filterationNumber!:'varchar';

  depositForm=new FormGroup({
    pch_chrgcode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    por_orgacode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    pch_chrgdesc:new FormControl('',[Validators.required,Validators.maxLength(40)]),
    pch_chrgshort:new FormControl('',[Validators.required,Validators.maxLength(20)]),
    pel_elmtcode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    ptr_trancode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    pch_chrgprofit:new FormControl('',[Validators.required,Validators.maxLength(1)]),
    soc_charges:new FormControl('',[Validators.maxLength(1)])
  })

  loanForm=new FormGroup({
    pch_chrgcode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    por_orgacode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    pch_chrgdesc:new FormControl('',[Validators.required,Validators.maxLength(40)]),
    pch_chrgshort:new FormControl('',[Validators.required,Validators.maxLength(20)]),
    pel_elmtcode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    ptr_trancode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    pch_chrginterest:new FormControl('',[Validators.maxLength(1)]),
    pch_chrgpenalty:new FormControl('',[Validators.required,Validators.maxLength(1)]),
    pch_chrgprincipal:new FormControl('',[Validators.required,Validators.maxLength(1)]),
    soc_charges:new FormControl('',[Validators.maxLength(1)])

  })



  constructor(private productService:ProductService,
    private toastr:ToastrService,
    private http:HttpClient,
    private FormBuilder:FormBuilder) { }

  ngOnInit(): void {

  }


populateTable(){
  this.chrgTable=!this.chrgTable;
  this.http.get<any>(`http://192.168.1.51:8080/getData/charges/all`)

  .subscribe((response) =>  {
    this.allCharges=response;
    this.dataFilteration=response;
  });
}
                         //Filter for  Table Of All Charges

filteration(){
  if(this.filterationNumber.length>0){
    this.dataFilteration = this.allCharges.filter((item: { pch_chrgcode: string; }) => item.pch_chrgcode === this.filterationNumber);
  }
  else{
    this.dataFilteration=this.charges
  }
   }




chargesTable(){
  this.showTable=!this.showTable;
  if(this.selectedOption=='generalledger'|| this.selectedOption=='loan'||this.selectedOption=='deposit'){
  this.http.get<any>(`http://192.168.1.51:8080/getData/charges/${this.selectedOption}`)
  .subscribe((response) =>  {
    this.charges=response;
    this.filteredData=response;
  });
   //this.filteredData = this.data;

}
}

filterData() {
if(this.searchNumber.length>0){
  this.filteredData = this.charges.filter((item: { pch_chrgcode: string; }) => item.pch_chrgcode === this.searchNumber);
}
else{
  this.filteredData=this.charges
}
 }


addCharges(form:NgForm){
  this.showCharges=!this.showCharges;

}




  onLoanSubmit(loanForm) {
    const url = `http://192.168.1.51:8080/addcolumns/${this.selectedOption}/charges/body`;
    const body = JSON.stringify(this.loanForm.value);
    console.log(body);
    console.log(this.selectedOption)
  if(loanForm.valid){
    this.http.post(url , body,{responseType:"text"}).subscribe(
      response => {
        if(response.includes("effected")){
        this.toastr.success("Data added succesfully");
        loanForm.reset();
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

 onDepositSubmit(depositForm){
  const url = `http://192.168.1.51:8080/addcolumns/${this.selectedOption}/charges/body`;
    const body = JSON.stringify(this.depositForm.value);
    console.log(body);
    console.log(this.selectedOption)
  if(depositForm.valid){
    this.http.post(url , body,{responseType:"text"}).subscribe(
      response => {
        if(response.includes("effected")){
        this.toastr.success("Data added succesfully");
        depositForm.reset();
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



editCharge(item: any){
  this.updateBtn=!this.updateBtn;
  this.hideBtn=!this.hideBtn;
this.selectedCharge = item;
if(this.selectedOption==='loan'){
    this.loanForm.patchValue({
     pch_chrgcode: item.pch_chrgcode,
     por_orgacode: item.por_orgacode,
     pch_chrgdesc: item.pch_chrgdesc,
     pch_chrgshort: item.pch_chrgshort,
     pel_elmtcode: item.pel_elmtcode,
     ptr_trancode: item.ptr_trancode,
     pch_chrginterest: item.pch_chrginterest,
     pch_chrgpenalty: item.pch_chrgpenalty,
     pch_chrgprincipal: item.pch_chrgprincipal,
     soc_charges: item.soc_charges
 });
}
else this.depositForm.patchValue({
    pch_chrgcode: item.pch_chrgcode,
     por_orgacode: item.por_orgacode,
     pch_chrgdesc: item.pch_chrgdesc,
     pch_chrgshort: item.pch_chrgshort,
     pel_elmtcode: item.pel_elmtcode,
     ptr_trancode: item.ptr_trancode,
     pch_chrgprofit: item.pch_chrgprofit,
     soc_charges:item.soc_charges
});
}
delCharge(selected: any ) {
  console.log(selected);
  const requestBody: String = JSON.stringify(selected);
    return this.http.delete(`http://192.168.1.51:8080/delete/${this.selectedOption}/charges/requestBody`, {body:requestBody}).subscribe(
      response=>{
        console.log('Charge Deleted Successfully');
        this.toastr.success(' Charge Deleted Successfully');
      },
    );

}
updateSelectedRows(item: any) {

    if (item.selected) {
    this.selectedRows.push(item);
    } else {
    const index = this.selectedRows.findIndex((selectedItem) => selectedItem.pch_chrgcode === item.pch_chrgcode && selectedItem.por_orgacode === item.por_orgacode);
      if (index !== -1) {
        this.selectedRows.splice(index, 1);
    }
  }
}


delMultipleCharges() {
  console.log(this.selectedRows);
  if(this.selectedOption==='loan'){
  const payload = this.selectedRows.map((selectedItem) => {
    return {
      pch_chrgcode: selectedItem.pch_chrgcode,
      por_orgacode: selectedItem.por_orgacode,
      pch_chrgdesc: selectedItem.pch_chrgdesc,
      pch_chrgshort: selectedItem.pch_chrgshort,
      pel_elmtcode: selectedItem.pel_elmtcode,
      ptr_trancode: selectedItem.ptr_trancode,
      pch_chrginterest: selectedItem.pch_chrginterest,
      pch_chrgpenalty: selectedItem.pch_chrgpenalty,
      pch_chrgprincipal: selectedItem.pch_chrgprincipal,
      soc_charges: selectedItem.soc_charges
    };
  });
  return this.http
    .delete(`http://http://192.168.1.51:8080/deleteAll/charges/${this.selectedOption}/requestBody`, { body: payload })
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
  else{

      const payload = this.selectedRows.map((selectedItem) => {
    return {
      pch_chrgcode: selectedItem.pch_chrgcode,
      por_orgacode: selectedItem.por_orgacode,
      pch_chrgdesc: selectedItem.pch_chrgdesc,
      pch_chrgshort: selectedItem.pch_chrgshort,
      pel_elmtcode: selectedItem.pel_elmtcode,
      ptr_trancode: selectedItem.ptr_trancode,
      pch_chrgprofit: selectedItem.pch_chrgprofit,
      soc_charges:selectedItem.soc_charges
    };
  });

  return this.http
    .delete(`http://http://192.168.1.51:8080/deleteAll/charges/${this.selectedOption}/requestBody`, { body: payload })
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
}



updateLoan( event:Event,loanForm){
    event.preventDefault();
    const url = `http://192.168.1.51:8080/update/charges/${this.selectedOption}/body`;
    const body = JSON.stringify(this.loanForm.value);
    console.log(body);
    console.log(this.selectedOption)
      if(loanForm.valid){
        this.http.put(url,body,{responseType:"text"}).subscribe(
          response => {
            console.log(response);
            console.log('Charge data Updated successfully');
              this.toastr.success('Charge data Updated successfully');
            },
            error => {
              this.toastr.warning('Error updating form data');
            }
          );
      }
  }

updateDeposit( event:Event,depositForm){
    event.preventDefault();
    const url = `http://192.168.1.51:8080/update/charges/${this.selectedOption}/body`;
    const body = JSON.stringify(this.depositForm.value);
    console.log(body);
    console.log(this.selectedOption)
      if(depositForm.valid){
        this.http.put(url,body,{responseType:"text"}).subscribe(
          response => {
            console.log(response);
            console.log('Charge data Updated successfully');
              this.toastr.success('Charge data Updated successfully');
            },
            error => {
              this.toastr.warning('Error updating form data');
            }
          );
      }
  }
  genScript(selected: any) {
    if(this.selectedOption==='loan'){
    const requestBody = {
      pch_chrgcode: selected.pch_chrgcode,
      por_orgacode: selected.por_orgacode,
      pch_chrgdesc: selected.pch_chrgdesc,
      pch_chrgshort: selected.pch_chrgshort,
      pel_elmtcode: selected.pel_elmtcode,
      ptr_trancode: selected.ptr_trancode,
      pch_chrginterest: selected.pch_chrginterest,
      pch_chrgpenalty: selected.pch_chrgpenalty,
      pch_chrgprincipal: selected.pch_chrgprincipal,
      soc_charges: selected.soc_charges,
    };
    console.log(requestBody);
    this.http
      .post<string>(
        `http://192.168.1.51:8080/generateScript/charges/${this.selectedOption}/requestBody`,
        requestBody,
        { responseType: 'text' as 'json' }
      )
      .subscribe((response) => {
        alert(response);
        console.log('Script Generated');
        this.toastr.success('Script Generated Successfully');
      });
  }
else{
  const requestBody = {
    pch_chrgcode: selected.pch_chrgcode,
    por_orgacode: selected.por_orgacode,
    pch_chrgdesc: selected.pch_chrgdesc,
    pch_chrgshort: selected.pch_chrgshort,
    pel_elmtcode: selected.pel_elmtcode,
    ptr_trancode: selected.ptr_trancode,
    pch_chrgprofit: selected.pch_chrgprofit,
    soc_charges: selected.soc_charges,
  };
  console.log(requestBody);
  this.http
  .post<string>(
    `http://192.168.1.51:8080/generateScript/charges/${this.selectedOption}/requestBody`,
    requestBody,
    { responseType: 'text' as 'json' }
  )
  .subscribe((response) => {
    alert(response);
    console.log('Script Generated');
    this.toastr.success('Script Generated Successfully');
  });
}

}

}
