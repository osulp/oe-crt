import {Component, Injectable} from '@angular/core';
import {COMMON_DIRECTIVES} from '@angular/common';

import {DND_DIRECTIVES} from 'ng2-dnd/ng2-dnd';

@Component({
    moduleId: module.id,
    selector: 'help',
    directives: [COMMON_DIRECTIVES, DND_DIRECTIVES],
    templateUrl: 'help.component.html'    
})
export class HelpComponent {
    simpleDrop: any = null;
    restrictedDrop1: any = null;
    restrictedDrop2: any = null;

    transferData: Object = { id: 1, msg: 'Hello' };
    receivedData: Array<any> = [];

    availableProducts: Array<Product> = [];
    shoppingBasket: Array<Product> = [];

    listOne: Array<string> = ['Coffee', 'Orange Juice', 'Red Wine', 'Unhealty drink!', 'Water'];

    listBoxers: Array<string> = ['Sugar Ray Robinson', 'Muhammad Ali', 'George Foreman', 'Joe Frazier', 'Jake LaMotta', 'Joe Louis', 'Jack Dempsey', 'Rocky Marciano', 'Mike Tyson', 'Oscar De La Hoya'];
    listTeamOne: Array<string> = [];
    listTeamTwo: Array<string> = [];

    listTwo: Array<string> = ['Coffee', 'Orange Juice', 'Red Wine', 'Unhealty drink!', 'Water'];
    listRecycled: Array<string> = [];

    dragOperation: boolean = false;

    containers: Array<Container> = [
        new Container(1, 'Container 1', [new Widget('1'), new Widget('2')]),
        new Container(2, 'Container 2', [new Widget('3'), new Widget('4')]),
        new Container(3, 'Container 3', [new Widget('5'), new Widget('6')])
    ];

    widgets: Array<Widget> = [];
    addTo($event:any) {
        if ($event) {
            this.widgets.push($event);
        }
    }

    constructor() {
        this.availableProducts.push(new Product('Blue Shoes', 3, 35));
        this.availableProducts.push(new Product('Good Jacket', 1, 90));
        this.availableProducts.push(new Product('Red Shirt', 5, 12));
        this.availableProducts.push(new Product('Blue Jeans', 4, 60));
    }

    orderedProduct(orderedProduct: Product) {
        orderedProduct.quantity--;
    }

    addToBasket(newProduct: Product) {
        for (let indx in this.shoppingBasket) {
            let product: Product = this.shoppingBasket[indx];
            if (product.name === newProduct.name) {
                product.quantity++;
                return;
            }
        }
        this.shoppingBasket.push(new Product(newProduct.name, 1, newProduct.cost));
    }

    totalCost(): number {
        let cost: number = 0;
        for (let indx in this.shoppingBasket) {
            let product: Product = this.shoppingBasket[indx];
            cost += (product.cost * product.quantity);
        }
        return cost;
    }

    transferDataSuccess($event:any) {
        this.receivedData.push($event);
    }
}

class Product {
    constructor(public name: string, public quantity: number, public cost: number) { }
}

class Container {
    constructor(public id: number, public name: string, public widgets: Array<Widget>) { }
}

class Widget {
    constructor(public name: string) { }
}