import { Component, Output, EventEmitter } from '@angular/core';

@Component ({
  selector:'search-box',
  template:`<div class='searchBoxWrapper'>
              <md-input #input2 placeholder="Filter" 
                (input)="update.emit(input2.value)"
                autocomplete="off">
              </md-input>
            </div>`
})

export class SearchBoxComponent {
  @Output() update = new EventEmitter();

  ngOnInit() {
    this.update.emit('');
  }
}