import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-project';
  durationInSeconds = 2;
  message : string = "No data.";

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'mobile',
    'gender',
    'address',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  // _snackBar !: MatSnackBar;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private api: ApiService, private _snackBar: MatSnackBar) {}
  ngOnInit(): void {
    this.getAllUsers();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.getAllUsers();
      }
    });
  }

  // get all records
  getAllUsers() {
    this.api.getUser().subscribe({
      next: (res) => {
        // alert("Get all users successfully.")
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource._updateChangeSubscription();
      },
      error: () => {
        this.openSnackBar("No data available.")
      },
    });
  }

  // update user
  updateUser(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '40%',
        data: row,
      })
      .afterClosed().subscribe((result) => {
        if (result === 'update') {
          this.getAllUsers();
        }
      });
  }

  // delete user
  deleteUser(id: number) {
    this.api.deleteUser(id).subscribe({
      next: (res) => {
        this.openSnackBar("User deleted successfully.");
        this.getAllUsers();
      },
      error:() =>{
        this.openSnackBar("User not deleted.");
      },
    });
  }

  // filter record
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // response message popup
  openSnackBar(message: string) {
    this._snackBar.open(message, "X", {
      duration : this.durationInSeconds * 1000,
    });
  }
}
