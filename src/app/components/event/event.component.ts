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
  editedValue: string | undefined;
  storedArray: any;
  selectedOption:string;
  selectedEvent: any;
  row: any;
  selectedRowData:{}
  selectedRowIndex = -1;
  data=[];

  eventForm=new FormGroup({
    pet_eventcode:new FormControl('',[Validators.required]),
    pet_eventdesc:new FormControl('',[Validators.required]),
    system_generated:new FormControl('',[Validators.required]),


  })





  constructor(
    private productService:ProductService,
    private http:HttpClient,
    private toastr:ToastrService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {

  }



  eventTable() {
      this.showEvent=!this.showEvent
      if(this.selectedOption=='generalledger'|| this.selectedOption=='loan'||this.selectedOption=='deposit'){
      this.http.get<any>(`http://192.168.1.80:8080/getData/event/${this.selectedOption}`)

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
    this.http.get<any>(`http://192.168.1.80:8080/getData/event/all`).subscribe((response)=>{
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
    const url = `http://192.168.1.80:8080/addcolumns/${this.selectedOption}/event/body`;
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
          return this.http.delete(`http://192.168.1.80:8080/delete/${this.selectedOption}/event/requestBody`, {body:requestBody}).subscribe(
            response=>{
              console.log('Event Deleted Successfully');
              this.toastr.success(' Event Deleted Successfully');
            },
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
    const url = `http://192.168.1.80:8080/update/event/${this.selectedOption}/body`;
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

genScript(event:MouseEvent, selected:any){
  // event.preventDefault;
  const requestBody: String =JSON.stringify(selected);

  this.http.post(`http://192.168.1.80:8080/generateScript/event/${this.selectedOption}/requestBody`,{body:requestBody},{responseType:'text'}).subscribe((response)=>{
    alert(response)
    console.log("Script Generated");
    this.toastr.success('Script Generated Successfully');

  });
  }
  deleteEvents(selected: any[]) {
    console.log(selected);
    const requestBody: string = JSON.stringify(selected);

    return this.http.delete(`http://192.168.1.80:8080/delete/${this.selectedOption}/event/requestBody`, { body: requestBody })
      .subscribe(
        () => {
          console.log('Events Deleted Successfully');
          this.toastr.success('Events Deleted Successfully');
        },
        (error) => {
          console.error('Error deleting events:');
          this.toastr.error('Error deleting events');
        }
      );
  }







}


