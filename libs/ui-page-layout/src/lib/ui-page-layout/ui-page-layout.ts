import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-ui-page-layout',
  standalone: true,
  imports: [],
  templateUrl: './ui-page-layout.html',
  styleUrl: './ui-page-layout.css',
})
export class UiPageLayout {
  @Input() pageTitle = '';
}
