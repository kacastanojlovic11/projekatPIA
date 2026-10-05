import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigacija } from "./navigacija/navigacija";
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigacija],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title="New app"
}
