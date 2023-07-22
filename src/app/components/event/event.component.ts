import { ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ProductService } from 'src/app/services/product-service.service';
import { FormGroup, FormBuilder, NgForm, FormControl,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})

export class EventComponent implements OnInit {

  updateBtn=false;
  hideBtn=true;
  showEvent=false;
  allEvents:any[]=[];
  allEventsTable=false;
  searchNumber!:'number';
  filterationNumber!:'number'
  filteredData: any[] = [];
  dataFilteration:any[]=[];
  events: any[]=[];
  updatedEvent: any[]=[];
  selectedRows:any[]=[];
  editedValue: string | undefined;
  storedArray: any;
  selectedOption:string;
  selectedItems: any[] = [];
  selectedEvent: any;
  row: any;
  selectedRowData:{}
  selectedRowIndex = -1;
  data=[];

  eventForm=new FormGroup({
    pet_eventcode:new FormControl('',[Validators.required]),
    pet_eventdesc:new FormControl('',[Validators.required]),
    system_generated:new FormControl('',[Validators.required,Validators.maxLength(1)]),


  })





  constructor(
    private productService:ProductService,
    private http:HttpClient,
    private toastr:ToastrService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {

  }



   eventTable() {
      this.showEvent=!this.showEvent
      if(this.selectedOption=='generalledger'|| this.selectedOption=='loan'||this.selectedOption=='deposit'){
      this.http.get<any>(`http://192.168.1.51:8080/getData/event/${this.selectedOption}`)

      .subscribe((response) =>  {
        this.events=response;
        this.filteredData=response;
      });
    }
   }
  filterData() {
      if(this.searchNumber!== null)
       this.filteredData = this.events.filter((item: { pet_eventcode: string; }) => item.pet_eventcode=== this.searchNumber);

      else
        this.filteredData=this.events
  }
  // Table For All events
  populateTable(){
    this.allEventsTable=!this.allEventsTable;
    this.http.get<any>(`http://192.168.1.51:8080/getData/event/all`).subscribe((response)=>{
      this.allEvents=response;
      this.dataFilteration=response;
    })

  }
  filteration(){
    if(this.filterationNumber.length>0)
      this.dataFilteration=this.allEvents.filter((item:{pet_eventcode:string;})=>item.pet_eventcode===this.filterationNumber)
    else
      this.dataFilteration=this.allEvents;
  }

  submitForm(eventForm) {
    // if(this.selectedOption==='deposit')
    const url = `http://192.168.1.51:8080/add/body`;
    const body = JSON.stringify(this.eventForm.value);
    console.log(body);
    console.log(this.selectedOption)
  if(eventForm.valid){
    this.http.post(url , body,{responseType:"text"}).subscribe(
      response => {
        if(response.includes("effected")){
        this.toastr.success("Data added succesfully");
        eventForm.reset();
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
   delEvent(selected: any ) {
        console.log(selected);
        const requestBody: String = JSON.stringify(selected);
          return this.http.delete(`http://192.168.1.51:8080/delete/${this.selectedOption}/event/requestBody`, {body:requestBody}).subscribe(
            response=>{
              console.log('Event Deleted Successfully');
              this.toastr.success(' Event Deleted Successfully');
            },
          );

    }
    updateSelectedRows(item: any) {

      if (item.selected) {
      this.selectedRows.push(item);
      } else {
      const index = this.selectedRows.findIndex((selectedItem) => selectedItem.pet_eventcode === item.pet_eventcode && selectedItem.pet_eventdesc === item.pet_eventdesc);
        if (index !== -1) {
          this.selectedRows.splice(index, 1);
      }
    }
  }

  delMultipleEvents(){
    console.log(this.selectedRows);
    const payload = this.selectedRows.map((selectedItem) => {
      return {
        pet_eventcode: selectedItem.pet_eventcode,
        pet_eventdesc: selectedItem.pet_eventdesc,
        system_generated: selectedItem.system_generated,

      };
    });
    return this.http
      .delete(`http://http://192.168.1.51:8080/deleteAll/event/${this.selectedOption}/requestBody`, { body: payload })
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


  editEvent(item: any){
    this.updateBtn=!this.updateBtn;
    this.hideBtn=!this.hideBtn;
    this.selectedEvent = item;
    this.eventForm.patchValue({
    pet_eventcode: item.pet_eventcode,
    pet_eventdesc: item.pet_eventdesc,
    system_generated: item.system_generated

  });

    }
  updateEvent(event:Event,eventForm ) {
    event.preventDefault();
    const url = `http://192.168.1.57:8080/update/event/${this.selectedOption}/body`;
    const body = JSON.stringify(this.eventForm.value);
    console.log(body);
    console.log(this.selectedOption)
    if(eventForm.valid){
        this.http.put(url,body,{responseType:"text"}).subscribe(
          response => {
            console.log(response);
            console.log('Event data Updated successfully');
              this.toastr.success('Event data Updated successfully');
            },
            error => {
              this.toastr.warning('Error updating form data');
            }
          );
      }
  }

  genScript(selected:any) {
    const requestBody = {
      pet_eventcode: selected.pet_eventcode,
        pet_eventdesc: selected.pet_eventdesc,
        system_generated: selected.system_generated,
    };
    console.log(requestBody);
    this.http
      .post<string>(
        `http://192.168.1.51:8080/generateScript/event/${this.selectedOption}/requestBody`,
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










