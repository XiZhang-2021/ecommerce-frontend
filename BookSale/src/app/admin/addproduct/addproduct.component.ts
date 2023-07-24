import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { Router} from "@angular/router";
import {environments} from "../../shared/environments/environments";

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})
export class AddproductComponent implements OnInit{
  addFormGroup! : FormGroup ;
  product : Object | undefined;
  imageUrl : string | undefined;
  fileForm: any;
  selectedFile : any;

  constructor(
    private fb : FormBuilder,
    private httpClient : HttpClient,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.addFormGroup = this.fb.group({
      name : ['', [Validators.required]],
      author : ['', [Validators.required]],
      price : ['', [ Validators.required]],
      description : ['', [Validators.required]],
      stock : ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$")]],
      genre : ['', [Validators.required]],
      timeversion : ['', [Validators.required]]
      // image : ['', [Validators.required]]
    });
    this.fileForm = this.fb.group({
      file : ['', [Validators.required]]
    });
  }

  add(){
    if(!!this.addFormGroup && this.imageUrl){
      console.log(this.imageUrl);
      if(this.addFormGroup.get('name') && this.addFormGroup.get('author') && this.addFormGroup.get('price')
        && this.addFormGroup.get('genre') && this.addFormGroup.get('stock') && this.addFormGroup.get('description') && this.addFormGroup.get('timeversion')){
        console.log(this.imageUrl);
        this.product = {
          "name" : this.addFormGroup.get('name')?.value,
          "author" : this.addFormGroup.get('author')?.value,
          "price" : this.addFormGroup.get('price')?.value,
          "stock" : this.addFormGroup.get('stock')?.value,
          "timeversion" : this.addFormGroup.get('timeversion')?.value,
          "genre" : this.addFormGroup.get('genre')?.value,
          //"image" : this.addFormGroup.get('image')?.value,
          "image" : this.imageUrl,
          "description" : this.addFormGroup.get('description')?.value
        };
        console.log(this.product);
        this.httpClient.post(environments.api+'/api/products/admin/create/book', this.product).subscribe(response => {
          // handle response here
          console.log(response);
          this.router.navigate(['/admin'])
        }, error => {
          // handle error here
          console.error(error);
        });
      }
    }
  }

  onFileChange($event: Event) {
    if($event.target !== null){
      const target = $event.target as HTMLInputElement;
      this.selectedFile = (target.files as FileList)[0];
    }
  }

  upLoadFile() {
    const formData = new FormData();
    if(this.selectedFile){
      formData.append('file', this.selectedFile);
      this.httpClient.post(environments.api+'/api/products/admin/saveimage', formData, {responseType: 'text'}).subscribe((res : any) => {
        this.imageUrl = res;
        console.log(res);
        alert('upload successfully!');
      });
    }
  }
}
