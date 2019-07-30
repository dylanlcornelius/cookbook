import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../item.service';
import { UserItem } from 'src/app/shopping-list/user-item.model';
import { CookieService } from 'ngx-cookie-service';
import { UserItemService } from 'src/app/shopping-list/user-item.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher, MatAccordion } from '@angular/material';
import { Notification } from 'src/app/modals/notification-modal/notification.enum';
import { Item } from '../item.model';

class ErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return (control && control.invalid && control.dirty);
  }
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ItemListComponent implements OnInit {
  loading = true;
  validationModalParams;
  notificationModalParams;

  displayedColumns = ['name', 'cartQuantity', 'remove', 'edit'];
  dataSource = [];
  uid: string;
  id: string;
  userItems = [];

  itemForm: FormGroup;

  matcher = new ErrorMatcher();

  @ViewChild('accordion') accordion: MatAccordion;

  constructor(
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private userItemService: UserItemService,
  ) { }

  ngOnInit() {
    this.itemForm = this.formBuilder.group({
      'name': [null, Validators.required],
    });

    this.uid = this.cookieService.get('LoggedIn');
    const myItems = [];
    this.userItemService.getUserItems(this.uid).subscribe(userItem => {
      this.id = userItem.id;
      this.itemService.getItems().subscribe(items => {
        items.forEach(item => {
          userItem.items.forEach(myItem => {
            if (myItem.id === item.id) {
              item.cartQuantity = myItem.cartQuantity;

              myItems.push({
                id: myItem.id,
                cartQuantity: myItem.cartQuantity
              });
            }
          });
        });
        this.dataSource = items;
        this.userItems = myItems;

        this.dataSource.forEach(item => {
          item.form = this.formBuilder.group({
            'name': [null, Validators.required],
          });
        });

        this.dataSource.sort((a, b) => a.name.localeCompare(b.name));

        this.loading = false;
      });
    });
  }

  packageData(self) {
    const data = [];
    self.userItems.forEach(d => {
      data.push({id: d.id, cartQuantity: d.cartQuantity});
    });
    return new UserItem(self.uid, data, self.id);
  }

  removeItem(id) {
    const data = this.userItems.find(x => x.id === id);
    const item = this.dataSource.find(x => x.id === id);
    if (data && Number(data.cartQuantity) > 0) {
      data.cartQuantity = Number(data.cartQuantity) - 1;
      item.cartQuantity = Number(item.cartQuantity) - 1;
      this.userItemService.putUserItem(this.packageData(this));
    }
  }

  addItem(id) {
    const data = this.userItems.find(x => x.id === id);
    const item = this.dataSource.find(x => x.id === id);
    if (data) {
      data.cartQuantity = Number(data.cartQuantity) + 1;
      item.cartQuantity = Number(item.cartQuantity) + 1;
    } else {
      this.userItems.push({id: id, cartQuantity: 1});
      item.cartQuantity = 1;
    }
    this.userItemService.putUserItem(this.packageData(this));
  }

  deleteItem(id: string, name: string) {
    this.validationModalParams = {
      function: this.deleteItemEvent,
      id: id,
      self: this,
      text: 'Are you sure you want to delete item ' + name + '?'
    };
  }

  deleteItemEvent(self, id) {
    self.itemService.deleteItem(id).subscribe(() => {
      self.notificationModalParams = {
        self: self,
        type: Notification.SUCCESS,
        text: 'Item deleted!'
      };
    }, (error) => {
      console.error(error);
    });
  }

  onFormSubmit(form: NgForm, id: string) {
    if (id) {
      this.itemService.putItem(id, form)
        .subscribe(() => {
          this.notificationModalParams = {
            self: self,
            type: Notification.SUCCESS,
            text: 'Item updated!'
          };

          // TODO: this.accordion.closeAll(); doesn't work
        }, (error) => {
          console.error(error);
        });
    } else {
      this.itemService.postItem(form)
        .subscribe((response: Item) => {
          this.notificationModalParams = {
            self: self,
            type: Notification.SUCCESS,
            text: 'Item added!'
          };

          this.accordion.closeAll();
          this.dataSource.push(response);
          this.itemForm = this.formBuilder.group({
            'name': [null, Validators.required],
          });
        }, (error) => {
          console.error(error);
        });
    }
  }
}
