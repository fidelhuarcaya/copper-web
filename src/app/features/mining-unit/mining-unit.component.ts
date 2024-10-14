import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MiningUnitService } from './services/mining-unit.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-mining-unit',
  standalone: true,
  imports: [...PRIMENG_MODULES,
    CommonModule,
    ReactiveFormsModule,
    ToolbarModule,
  ],
  providers: [MessageService, ConfirmationService, MiningUnitService],
  templateUrl: './mining-unit.component.html',
  styleUrl: './mining-unit.component.scss'
})
export class MiningUnitComponent  implements OnInit{
  miningUnits: any[] = [];
  miningUnitForm!: FormGroup;
  miningUnitDialog: boolean  = false;
  submitted: boolean  = false;

  constructor(
    private miningUnitService: MiningUnitService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadMiningUnits();
    this.initForm();
  }

  initForm() {
    this.miningUnitForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      urlLogo: new FormControl(null),
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
    } );
  }

  openNew() {
    this.submitted = false;
    this.miningUnitDialog = true;
    this.initForm();
  }

  deleteSelectedMiningUnit(miningUnit: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Mining Unit?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.miningUnitService.deleteMiningUnit(miningUnit.id).subscribe(
          () => {
            this.miningUnits = this.miningUnits.filter(val => val.id !== miningUnit.id);
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Mining Unit Deleted', life: 3000});
          },
          (error) => {
            console.error('Error deleting mining unit', error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to delete Mining Unit', life: 3000});
          }
        );
      }
    });
  }

  editMiningUnit(miningUnit: any) {
    this.miningUnitForm.patchValue(miningUnit);
    this.miningUnitDialog = true;
  }

  hideDialog() {
    this.miningUnitDialog = false;
    this.submitted = false;
    this.initForm();
  }

  saveMiningUnit() {
    this.submitted = true;

    if (this.miningUnitForm.valid) {
      const miningUnitData = this.miningUnitForm.value;
      if (miningUnitData.id) {
        this.miningUnitService.updateMiningUnit(miningUnitData.id, miningUnitData).subscribe(
          (result) => {
            this.miningUnits[this.findIndexById(result.id)] = result;
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Mining Unit Updated', life: 3000});
          },
          (error) => {
            console.error('Error updating mining unit', error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to update Mining Unit', life: 3000});
          }
        );
      } else {
        this.miningUnitService.createMiningUnit(miningUnitData).subscribe(
          (result) => {
            this.miningUnits.push(result);
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Mining Unit Created', life: 3000});
          },
          (error) => {
            console.error('Error creating mining unit', error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to create Mining Unit', life: 3000});
          }
        );
      }

      this.miningUnits = [...this.miningUnits];
      this.miningUnitDialog = false;
      this.initForm();
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.miningUnits.length; i++) {
      if (this.miningUnits[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  truncateUrlLogo(url: string): string {
    if (url && url.length > 30) {
      return url.substring(0, 27) + '...';
    }
    return url;
  }
}
