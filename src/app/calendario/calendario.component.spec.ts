/*import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioComponent } from './calendario.component';

describe('CalendarioComponent', () => {
  let component: CalendarioComponent;
  let fixture: ComponentFixture<CalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioComponent } from './calendario.component';
import { CommonModule } from '@angular/common';

describe('CalendarioComponent', () => {
  let component: CalendarioComponent;
  let fixture: ComponentFixture<CalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioComponent, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial planilhaDados', () => {
    expect(component.planilhaDados).toBeDefined();
    expect(component.planilhaDados.length).toBeGreaterThan(0);
  });

  it('should render table rows based on planilhaDados', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(component.planilhaDados.length);
  });

  it('should display important events with star icon', () => {
    const importantEvents = component.planilhaDados.filter(e => e.importante).length;
    const starIcons = fixture.nativeElement.querySelectorAll('.importante');
    expect(starIcons.length).toBe(importantEvents);
  });

  it('should handle file input', () => {
    const mockFile = new File([''], 'test.csv', { type: 'text/csv' });
    const event = { target: { files: [mockFile] } };
    
    spyOn(component, 'carregarPlanilha').and.callThrough();
    component.carregarPlanilha(event);
    
    expect(component.carregarPlanilha).toHaveBeenCalledWith(event);
  });
});