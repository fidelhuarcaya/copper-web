import { Component, inject } from '@angular/core';
import { NEBULAR_MODULES } from '../../nebular-imports';
import { User } from './interface/user.interface';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { UsersService } from './service/users.service';
interface Column {
  field: string;
  header: string;
}
interface Product {
  name: string;
  price: number;
  category: string;
  quantity: number;
  rating: string
}
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [...NEBULAR_MODULES, PRIMENG_MODULES],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [
  ],
})
export class UsersComponent {
  users: User[] = [];

  cols!: Column[];
  usersService = inject(UsersService)


  ngOnInit() {

    this.usersService.getAll().subscribe({
      next: (res) => {
        this.users = res;
      },
    })


    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'inventoryStatus', header: 'Status' },
      { field: 'rating', header: 'Rating' }
    ];
  }

}
