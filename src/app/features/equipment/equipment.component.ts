import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { StatusComponent } from '../../shared/components/status/status.component';
import { Equipment } from './interfaces/equipment.interface';
import { Area } from '../area/interfaces/area.interface';
import { Status } from '../../shared/interfaces/status.interface';
import { EquipmentService } from './service/equipmet.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StatusService } from '../../shared/service/status.service';
import { AreaService } from '../area/services/area.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    CommonModule,
    ToolbarModule,
    ReactiveFormsModule,
    StatusComponent,
  ], providers: [MessageService, ConfirmationService],

  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent {
  equipments: Equipment[] = [];
  areas: Area[] = [];
  statuses: Status[] = [];
  equipmentForm!: FormGroup;
  equipmentDialog: boolean = false;
  submitted: boolean = false;
  selectedEquipment: Equipment | null = null;
  constructor(
    private equipmentService: EquipmentService,
    private areaService: AreaService,
    private statusService: StatusService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadEquipment();
    this.loadAreas();
    this.loadStatuses();
    this.initForm();
  }

  initForm() {
    this.equipmentForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      areaId: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null, []),
    })
  }

  loadEquipment() {
    this.equipmentService.getAll().subscribe({
      next: (data) => {
        this.equipments = data;
      },
      error: (error) => {
        console.error('Error loading equipment', error);
      }
    });
  }

  loadAreas() {
    this.areaService.getAreas().subscribe(
      (data) => {
        this.areas = data;
      },
      (error) => {
        console.error('Error loading areas', error);
      }
    );
  }

  loadStatuses() {
    this.statusService.getAll().subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error('Error loading statuses', error);
      }
    });
  }

  openNew() {
    this.submitted = false;
    this.equipmentDialog = true;
    this.selectedEquipment = null;
  }

  deleteEquipment(equipment: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Equipment?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.equipmentService.deleteEquipment(equipment.id).subscribe(
          () => {
            this.equipments = this.equipments.filter(val => val.id !== equipment.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Equipment Deleted', life: 3000 });
          },
          (error) => {
            console.error('Error deleting equipment', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Equipment', life: 3000 });
          }
        );
      }
    });
  }

  editEquipment(equipment: Equipment) {
    this.equipmentForm.patchValue({
      ...equipment,
      areaId: equipment?.area?.id,
      statusId: equipment?.status?.id
    });
    this.equipmentDialog = true;
    this.selectedEquipment = equipment;
  }

  hideDialog() {
    this.equipmentDialog = false;
    this.submitted = false;
    this.initForm();
  }

  saveEquipment() {
    this.submitted = true;

    if (this.equipmentForm.valid) {
      const equipmentData = this.equipmentForm.value;
      if (this.selectedEquipment?.id) {
        this.equipmentService.updateEquipment(this.selectedEquipment.id, equipmentData).subscribe({
          next: (result) => {
            this.loadEquipment();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Equipment Updated', life: 3000 });
          },
          error: (error) => {
            console.error('Error updating equipment', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Equipment', life: 3000 });
          }
        });
      } else {
        this.equipmentService.createEquipment(equipmentData).subscribe({
          next: (result) => {
            this.loadEquipment();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Equipment Created', life: 3000 });
          },
          error: (error) => {
            console.error('Error creating equipment', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Equipment', life: 3000 });
          }
        }
        );
      }

      this.equipmentDialog = false;
      this.initForm();
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.equipments.length; i++) {
      if (this.equipments[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
