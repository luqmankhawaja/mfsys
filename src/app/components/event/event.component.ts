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
    petEventCode:new FormControl('',[Validators.required]),
    petEventDesc:new FormControl('',[Validators.required]),
    systemGenerated:new FormControl('',[Validators.required,Validators.maxLength(1)]),


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
      this.http.get<any>(`http://192.168.1.67:8080/${this.selectedOption}/event/view`)

      .subscribe((response) =>  {
        this.events=response;
        this.filteredData=response;
      });
    }
   }
   filterData() {
    if (this.searchNumber !== null) {
      this.filteredData = this.events.filter((item: { eventId: { petEventCode: number }; }) => item.eventId.petEventCode === Number(this.searchNumber));
    } else {
      this.filteredData = this.events;
    }
  }


  // Table For All events
  populateTable(){
    this.allEventsTable=!this.allEventsTable;
    this.http.get<any>(`http://192.168.1.67:8080/viewAll/event`).subscribe((response)=>{
      this.allEvents=response;
      this.dataFilteration=response;
    });

  }
  filteration(){
    if (this.filterationNumber !== null) {
      this.dataFilteration = this.allEvents.filter((item: { eventId: { petEventCode: number }; }) => item.eventId.petEventCode === Number(this.searchNumber));
    } else {
      this.dataFilteration = this.allEvents;
    }
  }

  submitForm(eventForm) {
    // if(this.selectedOption==='deposit')
    const url = `http://192.168.1.67:8080/${this.selectedOption}/event/add/body`;
    const  payload={
      eventId:{
        "petEventCode": eventForm.get('petEventCode').value || '',
        "dbName":this.selectedOption

      },

        "petEventDesc": eventForm.get('petEventDesc').value || '',
        "systemGenerated":eventForm.get('systemGenerated').value || ''

  }
    console.log(payload);
    console.log(this.selectedOption)
  if(eventForm.valid){
    this.http.post(url , payload).subscribe(
      response => {
        this.toastr.success("Data added succesfully");
        eventForm.reset();

  },(error: any) => {
    if(error){
      this.toastr.error("error");
      console.log(error)
    }
  }
    );
  }

}
delEvent(selected: any) {
  console.log(selected);
  const payload = [
    {

        petEventCode: selected.eventId.petEventCode,
        dbName: this.selectedOption

    }
  ];

  // Now you have an array containing the payload objects
  console.log(payload);


          return this.http.delete<any[]>(`http://192.168.1.67:8080/${this.selectedOption}/event/delete/payload`, {body:payload}).subscribe(
            response=>{
              console.log('Event Deleted Successfully');
              this.toastr.success(' Event Deleted Successfully');
            },
          );

    }
  delMultipleEvents(selectedItem:any){
    console.log(this.selectedRows);
    const payload = this.selectedRows.map((selectedItem) => {
      return {
        petEventCode: selectedItem.eventId.petEventCode,
        dbName: this.selectedOption,
      };
    });
    console.log(payload)
    return this.http
      .delete<any>(`http://192.168.1.67:8080/${this.selectedOption}/event/delete/payload`, {body:payload})
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
    petEventCode: item.eventId.petEventCode,
    petEventDesc: item.petEventDesc,
    systemGenerated: item.systemGenerated

  });

    }
    updateSelectedRows(item: any) {

      if (item.selected) {
      this.selectedRows.push(item);
      } else {
      const index = this.selectedRows.findIndex((selectedItem) => selectedItem.eventId.pet_eventcode === item.eventId.pet_eventcode && selectedItem.pet_eventdesc === item.pet_eventdesc);
        if (index !== -1) {
          this.selectedRows.splice(index, 1);
      }
    }
  }
  updateEvent(event:Event,eventForm ) {
    event.preventDefault();
    const url = `http://192.168.1.67:8080/${this.selectedOption}/event/update/body`;
    const  payload={
      eventId:{
        "petEventCode": eventForm.get('petEventCode').value || '',
        "dbName":this.selectedOption

      },

        "petEventDesc": eventForm.get('petEventDesc').value || '',
        "systemGenerated":eventForm.get('systemGenerated').value || ''

  }
    console.log(payload);
    console.log(this.selectedOption)
  if(eventForm.valid){
    this.http.put(url , payload).subscribe(
      response => {

        this.toastr.success("Data updated succesfully");
        eventForm.reset();

  },(error: any) => {
    if(error){
      this.toastr.error("error");
      console.log(error)
    }
  }
    );
  }

  }

  genScript(selected:any) {
    const requestBody = {
      eventId:{
      petEventCode: selected.eventId.petEventCode,
      dbName:this.selectedOption
      },
        petEventDesc: selected.petEventDesc,
        systemGenerated: selected.systemGenerated,
    };
    console.log(requestBody);
    this.http.post<any>(`http://192.168.1.67:8080/${this.selectedOption}/event/generateScript/requestBody`,{body:requestBody})
      .subscribe((response) => {
        alert(response);

        console.log('Script Generated');
        this.toastr.success('Script Generated Successfully');
      });
  }

}










