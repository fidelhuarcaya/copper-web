import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { MiningUnit } from '../mining-unit/interfaces/mining-unit.interface';
import { Status } from '../../shared/interfaces/status.interface';
import { Component, OnInit } from '@angular/core';
import { StatusService } from '../../shared/service/status.service';
import { MiningUnitService } from '../mining-unit/services/mining-unit.service';
import { Area } from './interfaces/area.interface';
import { AreaService } from './services/area.service';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { StatusComponent } from '../../shared/components/status/status.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    CommonModule,
    ToolbarModule,
    ReactiveFormsModule,
    StatusComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  areas: Area[] = [];
  miningUnits: MiningUnit[] = [];
  statuses: Status[] = [];
  areaForm!: FormGroup;
  areaDialog: boolean = false;
  submitted: boolean = false;

  selectedArea: Area | null = null;

  constructor(
    private areaService: AreaService,
    private miningUnitService: MiningUnitService,
    private statusService: StatusService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadAreas();
    this.loadMiningUnits();
    this.loadStatuses();
    this.initForm();
  }

  initForm() {
    this.areaForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      miningUnitId: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null, [Validators.required]),
    });
  }

  loadAreas() {
    this.areaService.getAreas().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (error) => {
        console.error('Error loading areas', error);
      }
    });
  }

  loadMiningUnits() {
    this.miningUnitService.getMiningUnits().subscribe({
      next: (data) => {
        this.miningUnits = data;
      },
      error: (error) => {
        console.error('Error loading mining units', error);
      }
    });
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
    this.areaDialog = true;
    this.selectedArea = null;
  }

  deleteArea(area: Area) {
    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas eliminar esta área?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.areaService.deleteArea(area.id).subscribe({
          next: () => {
            this.areas = this.areas.filter(val => val.id !== area.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Área Eliminada', life: 3000 });
          },
          error: (error) => {
            console.error('Error deleting area', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Area', life: 3000 });
          }
        });
      }
    });
  }

  editArea(area: Area) {
    this.selectedArea = area;
    this.areaForm.patchValue({
      ...area,
      miningUnitId: area?.miningUnit?.id,
      statusId: area?.status?.id
    });
    this.areaDialog = true;
  }

  hideDialog() {
    this.areaDialog = false;
    this.submitted = false;
    this.initForm();
  }

  saveArea() {
    this.submitted = true;

    if (this.areaForm.valid) {
      const areaData = this.areaForm.value;
      if (this.selectedArea?.id) {
        this.areaService.updateArea(this.selectedArea.id, areaData).subscribe(
          (result) => {
            this.loadAreas();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Area Updated', life: 3000 });
          },
          (error) => {
            console.error('Error updating area', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Area', life: 3000 });
          }
        );
      } else {
        this.areaService.createArea(areaData).subscribe(
          (result) => {
            this.loadAreas();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Area Created', life: 3000 });
          },
          (error) => {
            console.error('Error creating area', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Area', life: 3000 });
          }
        );
      }


      this.areaDialog = false;
      this.initForm();
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.areas.length; i++) {
      if (this.areas[i].id === id) {
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