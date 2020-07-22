import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {
    let c: number = 1;
    let b: number = 2;
    let e: string = '1';
    let f: string = '2';
    console.log('ok');
    console.log(c + b);
    console.log(e + f);

    let g: boolean = true;
    let h: object = {};
    console.log(g);
    console.log(h);

    let i = [c, b, e, f, g, h];
    console.log(i);

    let j: boolean[] = [false, g, true];
    console.log(j);
    let k: object[] = [{}, h, { super: '' }, { c }];
    console.log(k);

    let l: any[] = [1, 'abc', {}, []];
    console.log(l);
  }

  ngOnInit(): void {}
}
