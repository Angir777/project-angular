import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../services/layout/layout.service';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent {

  constructor(
    public layoutService: LayoutService,
  ) { }

}
