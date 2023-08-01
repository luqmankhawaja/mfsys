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
  showEditPopup = false;
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
    pchChrgCode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    porOrgaCode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    pchChrgDesc:new FormControl('',[Validators.required,Validators.maxLength(40)]),
    pchChrgShort:new FormControl('',[Validators.required,Validators.maxLength(20)]),
    pelElmtCode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    ptrTranCode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    pchChrgProfit:new FormControl('',[Validators.required,Validators.maxLength(1)]),
    socCharges:new FormControl('',[Validators.maxLength(1)])
  })

  loanForm=new FormGroup({
    pchChrgCode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    porOrgaCode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    pchChrgDesc:new FormControl('',[Validators.required,Validators.maxLength(40)]),
    pchChrgShort:new FormControl('',[Validators.required,Validators.maxLength(20)]),
    pelElmtCode:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    ptrTranCode:new FormControl('',[Validators.required,Validators.maxLength(3)]),
    pchChrgInterest:new FormControl('',[Validators.maxLength(1)]),
    pchChrgPenalty:new FormControl('',[Validators.required,Validators.maxLength(1)]),
    pchChrgPrincipal:new FormControl('',[Validators.required,Validators.maxLength(1)]),
    socCharges:new FormControl('',[Validators.maxLength(1)])

  })



  constructor(private productService:ProductService,
    private toastr:ToastrService,
    private http:HttpClient,
    private FormBuilder:FormBuilder) { }

  ngOnInit(): void {

  }
  chargesTable(){
    this.showTable=!this.showTable;
    if(this.selectedOption=='loan'||this.selectedOption=='deposit'){
    this.http.get<any>(`http://localhost:8080/${this.selectedOption}/charges/view`)
    .subscribe((response) =>  {
      this.charges=response;
      this.filteredData=response;
    });
     //this.filteredData = this.data;

  }
  }

  filterData() {
  if(this.searchNumber.length>0){
    this.filteredData = this.charges.filter((item:{ chargesId:{ pchChrgCode: string}; }) => item.chargesId.pchChrgCode === this.searchNumber);
  }
  else{
    this.filteredData=this.charges
  }
   }

populateTable(){
  this.chrgTable=!this.chrgTable;
  this.http.get<any>(`http://localhost:8080/viewAll/charges`)

  .subscribe((response) =>  {
    this.allCharges=response;
    this.dataFilteration=response;
  });
}
                         //Filter for  Table Of All Charges

filteration(){
  if(this.filterationNumber.length>0){
    this.dataFilteration = this.allCharges.filter((item:{ chargesId:{ pchChrgCode: string };}) => item.chargesId.pchChrgCode === this.filterationNumber);
  }
  else{
    this.dataFilteration=this.charges
  }
   }







addCharges(form:NgForm){
  this.showCharges=!this.showCharges;

}




  onLoanSubmit(loanForm) {
    const url = `http://localhost:8080/${this.selectedOption}/charges/add/body`;
    const body = {
      chargesId:{
        pchChrgCode:loanForm.get('pchChrgCode').value|| '',
        porOrgaCode:loanForm.get('porOrgaCode').value|| '',
      },
      pchChrgDesc:loanForm.get('pchChrgDesc').value|| '',
      pchChrgShort:loanForm.get('pchChrgShort').value|| '',
      pelElmtCode:loanForm.get('pelElmtCode').value|| '',
      ptrTranCode:loanForm.get('ptrTranCode').value|| '',
      pchChrgInterest:loanForm.get('pchChrgInterest').value||'',
      pchChrgPenalty:loanForm.get('pchChrgPenalty').value||'',
      pchChrgPrincipal:loanForm.get('pchChrgPrincipal').value||'',
      socCharges:loanForm.get('socCharges').value||''
    }
    console.log(body);
    console.log(this.selectedOption)
  if(loanForm.valid){
    this.http.post(url , body).subscribe(
      response => {

        this.toastr.success("Data added succesfully");
        loanForm.reset();
        this.showEditPopup = false;

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
  const url = `http://localhost:8080/${this.selectedOption}/charges/add/body`;
    const body = {
      chargesId:{
        pchChrgCode:depositForm.get('pchChrgCode').value|| '',
        porOrgaCode:depositForm.get('porOrgaCode').value|| '',
      },
      pchChrgDesc:depositForm.get('pchChrgDesc').value|| '',
      pchChrgShort:depositForm.get('pchChrgShort').value|| '',
      pelElmtCode:depositForm.get('pelElmtCode').value|| '',
      ptrTranCode:depositForm.get('ptrTranCode').value|| '',
      pchChrgProfit:depositForm.get('pchChrgProfit').value|| '',
      socCharges:depositForm.get('socCharges').value|| '',
    }
    console.log(body);
    console.log(this.selectedOption)
  if(depositForm.valid){
    this.http.post(url , body).subscribe(
      response => {
        this.toastr.success("Data added succesfully");
        depositForm.reset();

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

 toggleEditPopup() {
  this.showEditPopup = !this.showEditPopup;
}

editCharge(item: any){
  this.showEditPopup = !this.showEditPopup;
  this.updateBtn=!this.updateBtn;
  this.hideBtn=!this.hideBtn;
this.selectedCharge = item;
if(this.selectedOption==='loan' && item.selected){
    this.loanForm.patchValue({
     pchChrgCode: item.chargesId.pchChrgCode,
     porOrgaCode: item.chargesId.porOrgaCode,
     pchChrgDesc: item.pchChrgDesc,
     pchChrgShort: item.pchChrgShort,
     pelElmtCode: item.pelElmtCode,
     ptrTranCode: item.ptrTranCode,
     pchChrgInterest: item.pchChrgInterest,
     pchChrgPenalty: item.pchChrgPenalty,
     pchChrgPrincipal: item.pchChrgPrincipal,
     socCharges: item.socCharges
 });
}
else this.depositForm.patchValue({
    pchChrgCode: item.chargesId.pchChrgCode,
     porOrgaCode: item.chargesId.porOrgaCode,
     pchChrgDesc: item.pchChrgDesc,
     pchChrgShort: item.pchChrgShort,
     pelElmtCode: item.pelElmtCode,
     ptrTranCode: item.ptrTranCode,
     pchChrgProfit: item.pchChrgProfit,
     socCharges:item.socCharges
});
}
delCharge(selected: any ) {
  console.log(selected);
  const requestBody= [
    {
    pchChrgCode: selected.chargesId.pchChrgCode,
    porOrgaCode:selected.chargesId.porOrgaCode
    }
  ]
    return this.http.delete(`http://localhost:8080/${this.selectedOption}/charges/delete/requestBody`, {body:requestBody}).subscribe(
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
    const index = this.selectedRows.findIndex((selectedItem) => selectedItem.pchChrgCode === item.pchChrgCode && selectedItem.porOrgaCode === item.porOrgaCode);
      if (index !== -1) {
        this.selectedRows.splice(index, 1);
    }
  }
}


delMultipleCharges(selectedItem:any) {
  console.log(this.selectedRows);
  const payload = this.selectedRows.map((selectedItem) => {
    return {
      pchChrgCode: selectedItem.chargesId.pchChrgCode,
      porOrgaCode: selectedItem.chargesId.porOrgaCode
    };
  });
  console.log(payload)
  console.log(this.selectedOption)
  return this.http
    .delete(`http://localhost:8080/${this.selectedOption}/charges/delete/payload`, { body: payload })
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



updateLoan( event:Event,loanForm){
    event.preventDefault();
    const url = `http://localhost:8080/${this.selectedOption}/charges/update/body`;
    const body = {
      chargesId:{
        pchChrgCode:loanForm.get('pchChrgCode').value|| '',
        porOrgaCode:loanForm.get('porOrgaCode').value|| '',
      },
      pchChrgDesc:loanForm.get('pchChrgDesc').value|| '',
      pchChrgShort:loanForm.get('pchChrgShort').value|| '',
      pelElmtCode:loanForm.get('pelElmtCode').value|| '',
      ptrTranCode:loanForm.get('ptrTranCode').value|| '',
      pchChrgInterest:loanForm.get('pchChrgInterest').value||'',
      pchChrgPenalty:loanForm.get('pchChrgPenalty').value||'',
      pchChrgPrincipal:loanForm.get('pchChrgPrincipal').value||'',
      socCharges:loanForm.get('socCharges').value||''
    };
    console.log(body);
    console.log(this.selectedOption)
      if(loanForm.valid){
        this.http.put(url,body).subscribe(
          response => {
            console.log(response);
            console.log('Charge data Updated successfully');
              this.toastr.success('Charge data Updated successfully');
              loanForm.reset();
              this.showEditPopup=false;
            },
            error => {
              this.toastr.warning('Error updating form data');
            }
          );
      }
  }

updateDeposit( event:Event,depositForm){
    event.preventDefault();
    const url = `http://localhost:8080/${this.selectedOption}/charges/update/body`;
    const body ={
      chargesId:{
        pchChrgCode:depositForm.get('pchChrgCode').value|| '',
        porOrgaCode:depositForm.get('porOrgaCode').value|| '',
      },
      pchChrgDesc:depositForm.get('pchChrgDesc').value|| '',
      pchChrgShort:depositForm.get('pchChrgShort').value|| '',
      pelElmtCode:depositForm.get('pelElmtCode').value|| '',
      ptrTranCode:depositForm.get('ptrTranCode').value|| '',
      pchChrgProfit:depositForm.get('pchChrgProfit').value|| '',
      socCharges:depositForm.get('socCharges').value|| ''
    };
    console.log(body);
    console.log(this.selectedOption)
      if(depositForm.valid){
        this.http.put(url,body).subscribe(
          response => {
            console.log(response);
            console.log('Charge data Updated successfully');
              this.toastr.success('Charge data Updated successfully');
              depositForm.reset();
              this.showEditPopup=false;
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
      chargesId:{
        pchChrgCode: selected.chargesId.pchChrgCode,
        porOrgaCode: selected.chargesId.porOrgaCode,
      },
      pchChrgDesc: selected.pchChrgDesc,
      pchChrgShort: selected.pchChrgShort,
      pelElmtCode: selected.pelElmtCode,
      ptrTranCode: selected.ptrTranCode,
      pchChrgInterest: selected.pchChrgInterest,
      pchChrgPenalty: selected.pchChrgPenalty,
      pchChrgprincipal: selected.pchChrgprincipal,
      socCharges: selected.socCharges,
    };
    console.log(requestBody);

    this.http
      .post(`http://localhost:8080/${this.selectedOption}/charges/generateScript/requestBody`,requestBody,{ responseType: 'text' }).subscribe(
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
  }else
  {
    const requestBody = {
    chargesId:{
    pchChrgCode: selected.chargesId.pchChrgCode,
    porOrgaCode: selected.chargesId.porOrgaCode},

    pchChrgDesc: selected.pchChrgDesc,
    pchChrgShort: selected.pchChrgShort,
    pelElmtCode: selected.pelElmtCode,
    ptrTranCode: selected.ptrTranCode,
    pchChrgProfit: selected.pchChrgProfit,
    socCharges: selected.socCharges

  };
  console.log(requestBody);

  this.http.post(`http://localhost:8080/${this.selectedOption}/charges/generateScript/requestBody`,requestBody,{ responseType: 'text' }).subscribe(
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

}
