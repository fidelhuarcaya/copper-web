import { Component, inject } from '@angular/core';
import { NEBULAR_MODULES } from '../../nebular-imports';
import { User } from './interface/user.interface';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { UsersService } from './service/users.service';
import { UserFormComponent } from './user-form/user-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [...NEBULAR_MODULES, PRIMENG_MODULES],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [
    DialogService 
  ],
})
export class UsersComponent {
  users: User[] = [];
  usersService = inject(UsersService)
  modalService = inject(DialogService); // Inyectar el servicio del modal
  modalRef: DynamicDialogRef | undefined;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getAll().subscribe({
      next: (res) => {
        this.users = res;
      },
    });
  }
  
  // Crear un nuevo usuario
  createUser() {
    this.modalRef = this.modalService.open(UserFormComponent, {
      data: { user: null }, // Pasar null para crear un nuevo usuario
      header: 'Crear Usuario',
    });

    this.modalRef.onClose.subscribe((result: User) => {
      if (result) {
        this.users.push(result); // Agregar el nuevo usuario a la lista
      }
    });
  }

  // Editar un usuario existente
  updateUser(user: User) {
    this.modalRef = this.modalService.open(UserFormComponent, {
      data: { user }, // Pasar el usuario existente para editar
      header: 'Editar Usuario',

    });

    this.modalRef.onClose.subscribe((result: User) => {
      if (result) {
        const index = this.users.findIndex(u => u.id === result.id);
        if (index > -1) {
          this.users[index] = result; // Actualizar el usuario en la lista
        }
      }
    });
  }
}
