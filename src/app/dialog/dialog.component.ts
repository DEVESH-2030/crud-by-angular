import { Component, Inject } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { empty } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  userForm !: FormGroup;
  actionButton : string = "Save";
  formName : string = "Add User";
  message : string = "User added successfully.";
  durationInSeconds = 2;

  constructor (
    private FormBuilder: FormBuilder,
    private api : ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
      // set input fields and validation
      this.userForm = this.FormBuilder.group({
        name : ['', Validators.required],
        email : ['', Validators.required],
        mobile : ['', Validators.required],
        gender : ['', Validators.required],
        address : ['', Validators.required],
      });

      // edit record
      if(this.editData) {
        this.actionButton = "Update";
        this.formName = "Update User";
        this.userForm.controls['name'].setValue(this.editData.name);
        this.userForm.controls['email'].setValue(this.editData.email);
        this.userForm.controls['mobile'].setValue(this.editData.mobile);
        this.userForm.controls['gender'].setValue(this.editData.gender);
        this.userForm.controls['address'].setValue(this.editData.address);
      }
    }

    // add user
    addUser() {
      if (!this.editData){
        // console.log(1)
        if (!this.userForm.value){
          // console.log(this.userForm.value)
          this.openSnackBar("Please fill fields.")
        }else {
          if (this.userForm.valid){
            this.api.postUser(this.userForm.value)
            // observer
            .subscribe({
              next:(res) => {
                this.openSnackBar("User added successfully.");
                this.userForm.reset();
                this.dialogRef.close('save');
              },
              error:() => {
                this.openSnackBar("Something wrong.")
              }
            })
          }
        }
      } else {
        this.updateUser();
      }
    }

    // update user
    updateUser(){
      this.api.updateUser(this.userForm.value,this.editData.id)
      .subscribe({
        next:(res)=>{
          this.openSnackBar("User updated successfully.");
          this.userForm.reset()
          this.dialogRef.close('update');
        },
        error:(err)=>{
          this.openSnackBar("User not updated.");
        }
      })
    }

    // response message popup
    openSnackBar(message:string) {
      this._snackBar.open(message, "X", {
        duration :this.durationInSeconds * 1000,
      });
    }
}
