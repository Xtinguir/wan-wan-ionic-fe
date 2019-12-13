import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventAddPage } from './event-add.page';

describe('EventAddPage', () => {
  let component: EventAddPage;
  let fixture: ComponentFixture<EventAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
