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
  // hideIdCol=true;
  searchNumber!:'number';
  filteredData: any[] = [];
  events: any[]=[];
  updatedEvent: any[]=[];
  editedValue: string | undefined;
  storedArray: any;
  selectedOption:string;
  eventForm=new FormGroup({
    dmp_prodcode:new FormControl('',[Validators.required]),
    pet_eventcode:new FormControl('',[Validators.required]),
    por_orgacode:new FormControl('',[Validators.required]),
    ptr_trancode:new FormControl('',[Validators.required]),
    pet_eventseqnum:new FormControl('',[Validators.required]),
    pca_glaccredit:new FormControl('',[Validators.required]),
    pca_glacdebit:new FormControl('',[Validators.required]),
    generate:new FormControl('',[Validators.required]),
  })
  selectedEvent: any;




  constructor(
    private productService:ProductService,
    private http:HttpClient,
    private toastr:ToastrService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {

  }



  populateTable() {
      this.showEvent=!this.showEvent
      this.http.get<any>('http://localhost:3000/events')
  .subscribe((response) =>  {
    this.events=response;
    this.filteredData=response;
  });

   }
  filterData() {
      if(this.searchNumber!== null)
       this.filteredData = this.events.filter((item: { pet_eventcode: string; }) => item.pet_eventcode=== this.searchNumber);

      else
        this.filteredData=this.events
  }
  submitForm(eventForm) {

        const url = 'http://localhost:3000/events';
        // if(this.eventData==)
      if(eventForm.valid){
        const id = this.eventForm.value.pet_eventcode;
        this.http.get(url + '?id=' + id).subscribe(
          (response: any[]) => {
            if (response.length > 0) {
              this.toastr.error('ID already exists');
            }else{
        this.http.post(url,this.eventForm.value).subscribe(
          response => {
            console.log('Form data added successfully');
              this.toastr.success('Form data added successfully');
            },
            error => {
              this.toastr.warning('Error adding form data');
            }
          );
        }
      },
      error => {
        this.toastr.warning('Error checking ID existence');
      }
    );
    }
      eventForm.reset();
      }
    delEvent(id:any) {
        return this.http.delete('http://localhost:3000/events/'+id).subscribe(
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
    dmp_prodcode: item.dmp_prodcode,
    pet_eventcode: item.pet_eventcode,
    por_orgacode: item.por_orgacode,
    ptr_trancode: item.ptr_trancode,
    pet_eventseqnum: item.pet_eventseqnum,
    pca_glaccredit: item.pca_glaccredit,
    pca_glacdebit: item.pca_glacdebit,
    generate: item.downloadLink // Assuming you have a property named `generateLink` in `item`
  });

    }
    updateEvent(updatedData: any) {

      }


}

