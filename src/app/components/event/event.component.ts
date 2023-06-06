import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ProductService } from 'src/app/services/product-service.service';
import { FormGroup, FormBuilder, NgForm, Form } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})

export class EventComponent implements OnInit {

  showTable=false;
  showEvent=false;
  searchNumber!:'number';
  filteredData: any[] = [];
  events: any[]=[];
  updatedEvent: any[]=[];
  editedValue: string | undefined;



  constructor(
    private productService:ProductService,
    private http:HttpClient,
    private toastr:ToastrService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {

  }



  populateTable() {
      this.showTable=!this.showTable
      this.http.get<any>('http://localhost:3000/events')
  .subscribe((response) =>  {
    this.events=response;
    this.filteredData=response;
  });

   }
    filterData() {
      this.filteredData=[];
      this.filteredData = this.events.filter((item: { pet_eventcode: string; }) => item.pet_eventcode=== this.searchNumber);
    }

    eventData:any[]=[
      {dmp_prodcode:'',pet_eventcode:'',por_orgacode:'',ptr_trancode:'',pet_eventseqnum:'',pca_glaccredit:'',pca_glacdebit:'',generate:''}
    ]

    addEvent(form:NgForm) {
      this.showEvent=!this.showEvent;

    }

      // process the form data here

    submitForm(myForm:NgForm) {
        // Assuming you have a server endpoint at 'http://example.com/add-data' to handle data storage
        const url = 'http://localhost:3000/events';

        this.http.post(url,this.eventData[0]).subscribe(
          response => {
            console.log('Form data added successfully');
            this.toastr.success('Form data added successfully');

            // Additional logic after successful data addition
          },
          error => {
            this.toastr.warning('Please enter valid data');
            // Additional error handling logic
          }
        );

      }
      delEvent(id:any) {
        return this.http.delete('http://localhost:3000/events/'+id).subscribe(
          response=>{
            console.log('Event Deleted Successfully')
            this.toastr.success('Event Deleted successfully')
          },
        );


      }
      toggleEditing(item: any): void {
        item.editing = !item.editing;

        if (!item.editing) {
          // Reset the input field or perform any necessary actions
          this.updatedEvent[item.id] = undefined;
        }
      }
      updateEvent() {
          this.http.get<any[]>('http://localhost:3000/events').subscribe((data: any[]) => {
          const storedArray = data;
          let updated = false;
          for (let i = 0; i < storedArray.length; i++) {
            if (storedArray[i].yourValue === this.editedValue) {
              // Value already exists, no update needed
              console.log('No changes were made');
              return;
            }
            if (storedArray[i].id === 'someId') {
              // Assuming you have some condition to find the element you want to update
              storedArray[i].yourValue = this.editedValue; // Update the value in the array
              updated = true;
              break; // Exit the loop after updating the value
            }
          }

          if (updated) {
            // Send the updated array back to the server
            this.http.put('http://localhost:3000/events', storedArray).subscribe(() => {
              console.log('Update successful');
              this.toastr.success('Event updated successfully')

            });
          } else {
            console.log('Element not found');
          }
        });
      }



}

