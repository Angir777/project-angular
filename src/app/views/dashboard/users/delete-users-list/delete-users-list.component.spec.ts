import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUsersListComponent } from './delete-users-list.component';

describe('DeleteUsersListComponent', () => {
  let component: DeleteUsersListComponent;
  let fixture: ComponentFixture<DeleteUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUsersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
