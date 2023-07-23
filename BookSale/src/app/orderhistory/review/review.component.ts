import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit{
  reviewForm! : FormGroup;

  constructor(
    private fb : FormBuilder,
    public dialogRef : MatDialogRef<ReviewComponent>
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      review : ['', [Validators.required]]
    });
  }

  onSubmit(){
    if(this.reviewForm){
      this.dialogRef.close(this.reviewForm.value.review);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
